import { NextRequest, NextResponse } from "next/server";
import { searchLaws, searchPrecedents } from "@/lib/api/lawApi";

/* 상황 텍스트에서 법률 키워드를 추출하는 매핑 테이블 */
const SITUATION_KEYWORDS: { pattern: RegExp; keywords: string[]; category: string }[] = [
  // 근로/노동
  { pattern: /야근|연장근로|초과근무|잔업/, keywords: ["근로기준법", "연장근로"], category: "근로" },
  { pattern: /월급|임금|급여|봉급|수당/, keywords: ["근로기준법", "임금"], category: "근로" },
  { pattern: /해고|부당해고|권고사직|정리해고/, keywords: ["근로기준법", "부당해고"], category: "근로" },
  { pattern: /퇴직금|퇴직/, keywords: ["근로자퇴직급여보장법", "퇴직금"], category: "근로" },
  { pattern: /최저임금|최저시급/, keywords: ["최저임금법", "최저임금"], category: "근로" },
  { pattern: /연차|휴가|유급휴일/, keywords: ["근로기준법", "연차휴가"], category: "근로" },
  { pattern: /산재|산업재해|업무상재해/, keywords: ["산업재해보상보험법", "산업재해"], category: "근로" },
  { pattern: /직장내 괴롭힘|갑질|직장 괴롭힘/, keywords: ["근로기준법", "직장내 괴롭힘"], category: "근로" },
  { pattern: /4대보험|사회보험|건강보험/, keywords: ["국민건강보험법", "4대보험"], category: "근로" },

  // 부동산/임대차
  { pattern: /전세|보증금|임대차/, keywords: ["주택임대차보호법", "전세보증금"], category: "부동산" },
  { pattern: /월세|임대료|차임/, keywords: ["주택임대차보호법", "월세"], category: "부동산" },
  { pattern: /집주인|임대인|건물주/, keywords: ["주택임대차보호법", "임대인"], category: "부동산" },
  { pattern: /이사|퇴거|명도/, keywords: ["주택임대차보호법", "명도"], category: "부동산" },
  { pattern: /등기|소유권|부동산/, keywords: ["부동산등기법", "부동산"], category: "부동산" },
  { pattern: /재건축|재개발/, keywords: ["도시및주거환경정비법", "재건축"], category: "부동산" },

  // 가족/상속
  { pattern: /이혼|별거|위자료/, keywords: ["민법", "이혼"], category: "가족" },
  { pattern: /양육권|양육비|친권/, keywords: ["민법", "양육권"], category: "가족" },
  { pattern: /상속|유산|유언/, keywords: ["민법", "상속"], category: "가족" },
  { pattern: /결혼|혼인|약혼/, keywords: ["민법", "혼인"], category: "가족" },
  { pattern: /가정폭력|가폭/, keywords: ["가정폭력범죄의처벌등에관한특례법", "가정폭력"], category: "가족" },

  // 형사
  { pattern: /사기|보이스피싱|피싱/, keywords: ["형법", "사기"], category: "형사" },
  { pattern: /폭행|폭력|때리|맞/, keywords: ["형법", "폭행"], category: "형사" },
  { pattern: /절도|도둑|훔치/, keywords: ["형법", "절도"], category: "형사" },
  { pattern: /성범죄|성추행|성폭력|성희롱/, keywords: ["성폭력범죄의처벌등에관한특례법", "성범죄"], category: "형사" },
  { pattern: /명예훼손|모욕|악플/, keywords: ["형법", "명예훼손"], category: "형사" },
  { pattern: /스토킹|스토커/, keywords: ["스토킹범죄의처벌등에관한법률", "스토킹"], category: "형사" },

  // 교통
  { pattern: /음주운전|음주|만취/, keywords: ["도로교통법", "음주운전"], category: "교통" },
  { pattern: /교통사고|접촉사고|추돌/, keywords: ["교통사고처리특례법", "교통사고"], category: "교통" },
  { pattern: /면허취소|면허정지|운전면허/, keywords: ["도로교통법", "운전면허"], category: "교통" },
  { pattern: /주차위반|주차/, keywords: ["도로교통법", "주차"], category: "교통" },

  // 소비자
  { pattern: /환불|반품|교환/, keywords: ["전자상거래법", "환불"], category: "소비자" },
  { pattern: /계약해지|위약금|청약철회/, keywords: ["전자상거래법", "청약철회"], category: "소비자" },
  { pattern: /하자|불량|결함/, keywords: ["제조물책임법", "하자"], category: "소비자" },

  // IT/개인정보
  { pattern: /개인정보|정보유출|정보보호/, keywords: ["개인정보 보호법", "개인정보"], category: "IT" },
  { pattern: /저작권|불법복제|표절/, keywords: ["저작권법", "저작권"], category: "IT" },
  { pattern: /해킹|사이버/, keywords: ["정보통신망법", "해킹"], category: "IT" },

  // 기타
  { pattern: /소음|층간소음|이웃/, keywords: ["소음·진동관리법", "소음"], category: "생활" },
  { pattern: /반려동물|강아지|고양이|동물/, keywords: ["동물보호법", "동물"], category: "생활" },
  { pattern: /세금|탈세|종합소득세/, keywords: ["소득세법", "세금"], category: "세금" },
];

function extractKeywords(situation: string): { keywords: string[]; categories: string[] } {
  const matched = new Set<string>();
  const categories = new Set<string>();

  for (const entry of SITUATION_KEYWORDS) {
    if (entry.pattern.test(situation)) {
      entry.keywords.forEach((k) => matched.add(k));
      categories.add(entry.category);
    }
  }

  // 매칭 없으면 형태소 기반 간단 추출
  if (matched.size === 0) {
    const words = situation.replace(/[^가-힣a-zA-Z0-9\s]/g, "").split(/\s+/).filter((w) => w.length >= 2);
    words.slice(0, 3).forEach((w) => matched.add(w));
  }

  return { keywords: Array.from(matched), categories: Array.from(categories) };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { situation: string };
    const situation = body.situation || "";

    if (!situation.trim()) {
      return NextResponse.json({ success: false, error: "상황을 입력해 주세요." });
    }

    const { keywords, categories } = extractKeywords(situation);

    if (keywords.length === 0) {
      return NextResponse.json({
        success: true,
        keywords: [],
        categories: [],
        laws: [],
        precedents: [],
        graph: { nodes: [], edges: [] },
      });
    }

    // 법령 + 판례 병렬 검색 (키워드별)
    const lawPromises = keywords.map((kw) => searchLaws({ query: kw, page: 1, size: 5 }));
    const precPromises = keywords.map((kw) => searchPrecedents({ query: kw, page: 1, size: 3 }));

    const [lawResults, precResults] = await Promise.all([
      Promise.all(lawPromises),
      Promise.all(precPromises),
    ]);

    // 중복 제거
    const lawMap = new Map<string, { id: string; lawName: string; lawType: string; keyword: string }>();
    lawResults.forEach((result, i) => {
      result.data.forEach((law) => {
        if (!lawMap.has(law.lawId || law.id)) {
          lawMap.set(law.lawId || law.id, {
            id: law.lawId || law.id,
            lawName: law.lawName,
            lawType: law.lawType,
            keyword: keywords[i],
          });
        }
      });
    });

    const precMap = new Map<string, { id: string; caseName: string; court: string; caseNumber: string; keyword: string }>();
    precResults.forEach((result, i) => {
      result.data.forEach((prec) => {
        if (!precMap.has(prec.id)) {
          precMap.set(prec.id, {
            id: prec.id,
            caseName: prec.caseName,
            court: prec.court,
            caseNumber: prec.caseNumber,
            keyword: keywords[i],
          });
        }
      });
    });

    const laws = Array.from(lawMap.values()).slice(0, 15);
    const precedents = Array.from(precMap.values()).slice(0, 10);

    // 그래프 데이터 생성
    const nodes: { id: string; label: string; type: "situation" | "keyword" | "law" | "precedent"; meta?: string }[] = [];
    const edges: { source: string; target: string }[] = [];

    // 중앙 노드: 상황
    nodes.push({ id: "situation", label: situation.slice(0, 30) + (situation.length > 30 ? "..." : ""), type: "situation" });

    // 키워드 노드
    keywords.forEach((kw) => {
      const kwId = `kw-${kw}`;
      nodes.push({ id: kwId, label: kw, type: "keyword" });
      edges.push({ source: "situation", target: kwId });
    });

    // 법령 노드
    laws.forEach((law) => {
      const lawId = `law-${law.id}`;
      nodes.push({ id: lawId, label: law.lawName, type: "law", meta: law.lawType });
      edges.push({ source: `kw-${law.keyword}`, target: lawId });
    });

    // 판례 노드
    precedents.forEach((prec) => {
      const precId = `prec-${prec.id}`;
      nodes.push({ id: precId, label: prec.caseName.slice(0, 25) + (prec.caseName.length > 25 ? "..." : ""), type: "precedent", meta: prec.court });
      edges.push({ source: `kw-${prec.keyword}`, target: precId });
    });

    return NextResponse.json({
      success: true,
      keywords,
      categories,
      laws,
      precedents,
      graph: { nodes, edges },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "분석 중 오류 발생";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
