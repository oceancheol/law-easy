"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Loading from "@/components/ui/Loading";
import LawGraph from "@/components/ui/LawGraph";

interface GraphNode {
  id: string;
  label: string;
  type: "situation" | "keyword" | "law" | "precedent";
  meta?: string;
}

interface GraphEdge {
  source: string;
  target: string;
}

interface LawResult {
  id: string;
  lawName: string;
  lawType: string;
  keyword: string;
}

interface PrecedentResult {
  id: string;
  caseName: string;
  court: string;
  caseNumber: string;
  keyword: string;
}

interface SituationResponse {
  success: boolean;
  keywords: string[];
  categories: string[];
  laws: LawResult[];
  precedents: PrecedentResult[];
  graph: { nodes: GraphNode[]; edges: GraphEdge[] };
  error?: string;
}

const EXAMPLE_SITUATIONS = [
  "회사에서 야근수당을 안 줘요",
  "집주인이 전세보증금을 안 돌려줘요",
  "온라인에서 산 물건을 환불받고 싶어요",
  "이웃집 층간소음이 너무 심해요",
  "직장에서 부당해고를 당했어요",
  "교통사고가 났는데 상대방이 보험처리를 거부해요",
  "인터넷에서 내 개인정보가 유출된 것 같아요",
  "이혼하면 양육권은 어떻게 되나요?",
];

export default function SituationPage() {
  const router = useRouter();
  const [situation, setSituation] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SituationResponse | null>(null);

  async function handleAnalyze() {
    if (!situation.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/situation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situation: situation.trim() }),
      });
      const data: SituationResponse = await res.json();
      setResult(data);
    } catch {
      setResult({ success: false, keywords: [], categories: [], laws: [], precedents: [], graph: { nodes: [], edges: [] }, error: "분석 중 오류가 발생했습니다." });
    } finally {
      setLoading(false);
    }
  }

  function handleExampleClick(example: string) {
    setSituation(example);
  }

  function handleNodeClick(node: { id: string; label: string; type: string; meta?: string }) {
    if (node.type === "law") {
      const lawId = node.id.replace("law-", "");
      router.push(`/law/${lawId}`);
    } else if (node.type === "precedent") {
      const precId = node.id.replace("prec-", "");
      router.push(`/precedent/${precId}`);
    } else if (node.type === "keyword") {
      router.push(`/search?q=${encodeURIComponent(node.label)}`);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
        내 상황에 맞는 법률 찾기 🔮
      </h1>
      <p className="text-sm text-[var(--text-muted)] mb-6">
        겪고 있는 상황을 설명하면, 관련 법령과 판례를 찾아서 그래프로 보여줘요!
      </p>

      {/* 입력 영역 */}
      <Card className="mb-6">
        <textarea
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          placeholder="어떤 상황인지 자유롭게 설명해 주세요...&#10;&#10;예: 회사에서 2년 넘게 일했는데 갑자기 해고 통보를 받았어요. 사유도 제대로 안 알려줬어요."
          className="w-full h-32 p-4 rounded-lg bg-[var(--muted-bg)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] resize-none"
        />
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-4">
          <p className="text-xs text-[var(--text-muted)]">
            {situation.length > 0 ? `${situation.length}자` : "상황을 구체적으로 설명할수록 정확해요"}
          </p>
          <button
            onClick={handleAnalyze}
            disabled={!situation.trim() || loading}
            className="w-full sm:w-auto px-6 py-3 sm:py-2.5 bg-[var(--primary)] text-white rounded-lg font-medium text-sm hover:bg-[var(--primary-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            style={{ boxShadow: "0 1px 2px rgba(43, 76, 126, 0.2)" }}
          >
            {loading ? "분석 중..." : "법률 분석하기 🔍"}
          </button>
        </div>
      </Card>

      {/* 예시 상황 */}
      {!result && !loading && (
        <div className="mb-8">
          <p className="text-sm font-medium text-[var(--text-muted)] mb-3">
            이런 상황을 검색해 보세요
          </p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_SITUATIONS.map((example) => (
              <button
                key={example}
                onClick={() => handleExampleClick(example)}
                className="keyword-pill text-left"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && <Loading category="법령" />}

      {/* 분석 결과 */}
      {result && result.success && (
        <div>
          {/* 추출 키워드 */}
          {result.keywords.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium text-[var(--foreground)] mb-2">
                추출된 법률 키워드
              </p>
              <div className="flex flex-wrap gap-2">
                {result.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium bg-[var(--primary-light)] text-[var(--primary)]"
                  >
                    {kw}
                  </span>
                ))}
                {result.categories.map((cat) => (
                  <span
                    key={cat}
                    className="px-3 py-1.5 rounded-lg text-sm bg-[var(--muted-bg)] text-[var(--text-muted)]"
                  >
                    #{cat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 그래프 뷰 */}
          {result.graph.nodes.length > 0 && (
            <Card className="mb-6 !p-0 overflow-hidden">
              <div className="px-4 py-3 border-b border-[var(--border-light)] bg-[var(--muted-bg)]">
                <h2 className="text-sm font-semibold text-[var(--foreground)]">
                  법률 관계 그래프 — 노드를 클릭하면 상세 페이지로 이동해요
                </h2>
              </div>
              <LawGraph
                nodes={result.graph.nodes}
                edges={result.graph.edges}
                onNodeClick={handleNodeClick}
              />
            </Card>
          )}

          {/* 관련 법령 목록 */}
          {result.laws.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">
                관련 법령 ({result.laws.length}건)
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {result.laws.map((law) => (
                  <Card
                    key={law.id}
                    hoverable
                    variant="law"
                    onClick={() => router.push(`/law/${law.id}`)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Badge label={law.lawType} />
                      <span className="text-xs text-[var(--text-muted)]">
                        &quot;{law.keyword}&quot;에서 발견
                      </span>
                    </div>
                    <h3 className="font-semibold text-[var(--foreground)]">
                      {law.lawName}
                    </h3>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* 관련 판례 목록 */}
          {result.precedents.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">
                관련 판례 ({result.precedents.length}건)
              </h2>
              <div className="space-y-3">
                {result.precedents.map((prec) => (
                  <Card
                    key={prec.id}
                    hoverable
                    variant="law"
                    onClick={() => router.push(`/precedent/${prec.id}`)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Badge label={prec.court} />
                      <span className="text-xs text-[var(--text-muted)]">{prec.caseNumber}</span>
                      <span className="text-xs text-[var(--text-muted)] ml-auto">
                        &quot;{prec.keyword}&quot;에서 발견
                      </span>
                    </div>
                    <h3 className="font-semibold text-[var(--foreground)] text-sm">
                      {prec.caseName}
                    </h3>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* 결과 없음 */}
          {result.laws.length === 0 && result.precedents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-4xl mb-4">🤔</p>
              <p className="text-[var(--text-muted)]">
                관련 법령을 찾지 못했어요. 좀 더 구체적으로 설명해 주세요!
              </p>
            </div>
          )}
        </div>
      )}

      {/* 에러 */}
      {result && !result.success && (
        <div className="text-center py-12">
          <p className="text-4xl mb-4">⚠️</p>
          <p className="text-[var(--text-muted)]">{result.error}</p>
        </div>
      )}
    </div>
  );
}
