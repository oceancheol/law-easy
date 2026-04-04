# ⚖️ 법령이지 (LawEasy)

> 누구나 쉽게 찾는 대한민국 법률 — 법제처 Open API 기반 공공서비스

## 주요 기능

### 📘 법령 검색
- 키워드 및 약칭 자동 인식 (예: "화관법" → 화학물질관리법)
- 법률·시행령·시행규칙 구분 표시
- 소관부처, 시행일자 필터링
- 조문별 상세 보기

### ⚖️ 판례 검색
- 대법원·하급심·헌법재판소 법원별 필터
- 판시사항/요지 미리보기
- 판례 전문 보기
- 관련 법령 자동 연결

### 🔍 신구대조 비교
- 법령 개정 전후 비교
- 변경 부분 하이라이트 (🟢 신설 / 🔴 삭제 / 🟡 수정)
- 개정 이력 타임라인

### 🤖 AI 법률 질의응답 (Phase 2 예정)
- 자연어 법률 질문
- 관련 법령·판례 자동 인용

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 14 (App Router) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS |
| 폰트 | Noto Serif KR + Pretendard |
| 법령 API | 법제처 Open API |
| 배포 | Vercel |

## 디자인

공공기관 권위 있는 스타일 ([Tribunal Template](https://www.rocket.new/templates/tribunal-authoritative-international-landing-page-template) 참고)

- **배경**: 파치먼트 화이트 (#F5F0EB)
- **제목**: 챔버 오크 (#3E2C1E) + Noto Serif KR
- **상호작용**: 정의 파란색 (#2B4C7E)

## 시작하기

### 1. 법제처 API 키 발급

[법제처 Open API](https://open.law.go.kr) 에서 무료 인증키(OC)를 발급받으세요.

### 2. 설치 및 실행

```bash
# 클론
git clone https://github.com/oceancheol/law-easy.git
cd law-easy

# 의존성 설치
pnpm install

# 환경변수 설정
cp .env.example .env
# .env 파일에 LAW_API_KEY 입력

# 개발 서버 실행
pnpm dev
```

http://localhost:3000 에서 확인

### 3. 배포

```bash
# Vercel 배포
vercel
```

## 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx              # 메인 (통합 검색)
│   ├── search/page.tsx       # 법령 검색 결과
│   ├── law/[id]/page.tsx     # 법령 상세
│   ├── precedent/page.tsx    # 판례 검색
│   ├── precedent/[id]/page.tsx # 판례 상세
│   ├── compare/page.tsx      # 신구대조 비교
│   └── api/                  # API 라우트
├── components/
│   ├── layout/               # Header, Footer
│   └── ui/                   # SearchBar, Card, Badge 등
├── lib/
│   ├── api/lawApi.ts         # 법제처 API 클라이언트
│   └── utils/                # 약칭 변환, 포맷 유틸
└── types/                    # TypeScript 타입 정의
```

## 데이터 출처

- [국가법령정보센터](https://www.law.go.kr)
- [법제처 Open API](https://open.law.go.kr)

## 라이선스

MIT
