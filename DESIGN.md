# DESIGN.md — 법령이지 (LawEasy) Design System

> 누구나 쉽게 찾는 대한민국 법률 — 공공서비스 웹 애플리케이션

---

## 1. Visual Theme & Atmosphere

**Design Philosophy:** Authoritative Warmth — 공공기관의 권위성과 신뢰감을 유지하면서 현대적이고 접근성 높은 경험을 제공한다.

- **Density:** Spacious — 법조문의 가독성을 위해 충분한 여백 확보
- **Mood:** Calm, trustworthy, professional — 법률 서비스의 신중함
- **Aesthetic:** Parchment-inspired warmth + modern editorial layout
- **Motion:** Subtle — 아코디언 펼침, 호버 전환 정도의 절제된 애니메이션
- **Feel:** "도서관에서 법전을 펼치는 느낌을 디지털로"

---

## 2. Color Palette & Roles

### Light Mode (Primary)

| Role | Name | HEX | Usage |
|------|------|-----|-------|
| **Background** | Parchment White | `#F5F0EB` | 페이지 배경 — 따뜻하고 무게감 있는 중성 톤 |
| **Surface** | Pure White | `#FFFFFF` | 카드, 모달, 입력 필드 배경 |
| **Foreground** | Chamber Oak | `#3E2C1E` | 제목, 강조 텍스트 — 권위 있는 진한 갈색 |
| **Body Text** | Deliberate Gray | `#6B7B8D` | 본문 텍스트 — 신중하고 절제된 톤 |
| **Primary** | Justice Blue | `#2B4C7E` | 버튼, 링크, 활성 상태 — 법의 정의를 상징 |
| **Primary Hover** | Deep Navy | `#1A3A5C` | 호버, 포커스 상태 |
| **Primary Light** | Soft Blue | `#E8EEF5` | 선택된 탭 배경, 배지 배경 |
| **Border** | Warm Gray | `#D5CFC7` | 카드 테두리, 구분선 |
| **Border Light** | Light Warm | `#E8E3DC` | 미세한 구분선 |
| **Success** | Verdict Green | `#27AE60` | 성공 메시지, 신규 조문(신구대조) |
| **Error** | Objection Red | `#C0392B` | 에러, 삭제된 조문(신구대조) |
| **Warning** | Amendment Yellow | `#F39C12` | 경고, 수정된 조문(신구대조) |
| **Muted Background** | Soft Parchment | `#FAF8F5` | 섹션 구분, 코드 블록 배경 |

### Semantic Usage

```
Hero gradient:     linear-gradient(to bottom, #FFFFFF, #F5F0EB)
Card shadow:       0 1px 3px rgba(62, 44, 30, 0.08)
Card hover shadow: 0 4px 12px rgba(62, 44, 30, 0.12)
Focus ring:        0 0 0 3px rgba(43, 76, 126, 0.2)
Divider:           1px solid #D5CFC7
```

---

## 3. Typography Rules

### Font Stack

| Role | Font | Fallback | Weight | Usage |
|------|------|----------|--------|-------|
| **Heading** | Noto Serif KR | Georgia, serif | 600–900 | H1–H4, 법령명, 서비스 타이틀 |
| **Body / UI** | Pretendard | -apple-system, sans-serif | 400–600 | 본문, 버튼, 네비게이션, 라벨 |
| **Legal Text** | D2Coding | monospace | 400 | 법조문 내용, 코드 블록 |

### Type Scale

| Element | Size | Weight | Line Height | Letter Spacing | Color |
|---------|------|--------|-------------|----------------|-------|
| **H1 (Hero)** | 48px / 3rem | 900 | 1.2 | -0.02em | Chamber Oak |
| **H2 (Section)** | 28px / 1.75rem | 700 | 1.3 | -0.01em | Chamber Oak |
| **H3 (Subsection)** | 22px / 1.375rem | 600 | 1.4 | 0 | Chamber Oak |
| **H4 (Card Title)** | 18px / 1.125rem | 600 | 1.4 | 0 | Chamber Oak |
| **Body Large** | 18px / 1.125rem | 400 | 1.7 | 0 | Deliberate Gray |
| **Body** | 16px / 1rem | 400 | 1.6 | 0 | Deliberate Gray |
| **Body Small** | 14px / 0.875rem | 400 | 1.5 | 0 | Deliberate Gray |
| **Caption** | 12px / 0.75rem | 500 | 1.4 | 0.02em | Deliberate Gray |
| **Legal Article** | 15px / 0.9375rem | 400 | 1.8 | 0 | Chamber Oak |
| **Button** | 15px / 0.9375rem | 600 | 1 | 0 | White / Primary |
| **Nav Link** | 14px / 0.875rem | 500 | 1 | 0 | Gray / Primary |

---

## 4. Component Stylings

### Buttons

**Primary Button:**
```
Background: Justice Blue (#2B4C7E)
Text: White
Padding: 12px 24px
Border-radius: 8px
Font: Pretendard 600, 15px
Hover: Deep Navy (#1A3A5C)
Active: scale(0.98)
Transition: all 150ms ease
Shadow: 0 1px 2px rgba(43, 76, 126, 0.2)
```

**Secondary Button (Outline):**
```
Background: transparent
Border: 1.5px solid #D5CFC7
Text: Chamber Oak
Hover: background #FAF8F5, border #2B4C7E
```

**Ghost Button:**
```
Background: transparent
Text: Justice Blue
Hover: background #E8EEF5
Padding: 8px 16px
```

**Keyword Pill:**
```
Background: White
Border: 1px solid #D5CFC7
Border-radius: 9999px
Padding: 6px 14px
Font: 14px
Hover: border Justice Blue, text Justice Blue
```

### Cards

**Standard Card:**
```
Background: White
Border: 1px solid #D5CFC7
Border-radius: 12px
Padding: 24px
Shadow: 0 1px 3px rgba(62, 44, 30, 0.08)
Hover: shadow 0 4px 12px rgba(62, 44, 30, 0.12), border Justice Blue
Transition: all 200ms ease
```

**Law Result Card:**
```
Standard Card +
Left border: 4px solid transparent
Hover left border: 4px solid Justice Blue
Contains: Badge (법률/시행령/시행규칙), 법령명(H4), 소관부처, 시행일, 요지 2줄
```

**Feature Card:**
```
Standard Card +
Text-align: center
Icon: 48px emoji
Padding: 32px 24px
Hover: translate-y(-2px)
```

### Search Bar

**Hero Search:**
```
Background: White
Border: 2px solid #D5CFC7
Border-radius: 12px
Padding: 16px 20px (with 48px icon space)
Font: 18px Pretendard
Focus: border Justice Blue, shadow focus ring
Height: 56px
Icon: 🔍 20px, color Deliberate Gray
```

**Compact Search (Header):**
```
Same as Hero but:
Height: 40px
Font: 14px
Border-radius: 8px
Padding: 8px 16px
```

### Badges

```
Padding: 4px 10px
Border-radius: 6px
Font: 12px, weight 600
Variants:
  법률:     bg #E8EEF5, text #2B4C7E
  시행령:   bg #E8F5E9, text #27AE60
  시행규칙: bg #FFF3E0, text #F39C12
  대법원:   bg #E8EEF5, text #1A3A5C
  헌재:     bg #FCE4EC, text #C0392B
```

### Accordion (법조문)

```
Summary:
  Padding: 12px 16px
  Font: Pretendard 600, 15px
  Color: Chamber Oak
  Cursor: pointer
  Hover: background #FAF8F5
  Arrow: ▶ → ▼ rotation 90deg, transition 200ms

Content:
  Padding: 16px 16px 16px 32px
  Font: D2Coding or Pretendard, 15px
  Line-height: 1.8
  Color: Chamber Oak
  Border-left: 2px solid #E8E3DC
```

### Navigation

**Header Nav:**
```
Height: 64px
Background: White
Border-bottom: 1px solid #D5CFC7
Shadow: 0 1px 3px rgba(62, 44, 30, 0.06)
Logo: ⚖️ + "법령이지" (Noto Serif KR 700, 20px)
Nav links: Pretendard 500, 14px
Active: bg Justice Blue, text White, border-radius 8px, padding 8px 16px
Inactive: text Deliberate Gray, hover bg #FAF8F5
```

**Mobile Nav:**
```
Hamburger menu at 768px breakpoint
Slide-in from right
Full-width links with 48px touch targets
```

### Tabs

```
Container: border-bottom 2px solid #E8E3DC
Tab:
  Padding: 12px 20px
  Font: Pretendard 500, 14px
  Color: Deliberate Gray
  Active: color Justice Blue, border-bottom 2px solid Justice Blue
  Hover: color Chamber Oak
```

### Pagination

```
Button size: 36px × 36px
Border-radius: 8px
Current: bg Justice Blue, text White
Other: bg White, border #D5CFC7, text Deliberate Gray
Hover: border Justice Blue
Gap: 4px
```

---

## 5. Layout Principles

### Spacing Scale (Base: 4px)

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | 아이콘-텍스트 간격 |
| `sm` | 8px | 인라인 요소 간격 |
| `md` | 16px | 컴포넌트 내부 패딩 |
| `lg` | 24px | 카드 패딩, 섹션 간격 |
| `xl` | 32px | 섹션 간 여백 |
| `2xl` | 48px | 히어로 상하 패딩 |
| `3xl` | 64px | 메인 섹션 간 간격 |
| `4xl` | 96px | 히어로 섹션 높이 여백 |

### Grid System

```
Max width: 1280px (7xl)
Content max: 1024px (law detail), 768px (hero content)
Columns: 1 (mobile) → 2 (tablet) → 3 (desktop, feature cards)
Gutter: 24px
Side padding: 16px (mobile) → 24px (tablet) → 32px (desktop)
```

### Section Pattern

```
<section> — full width, alternating bg (Parchment / White)
  <div max-w-7xl mx-auto px-4~8>
    <h2> — section title, center or left aligned
    <content> — grid or single column
  </div>
</section>
```

---

## 6. Depth & Elevation

| Level | Shadow | Usage |
|-------|--------|-------|
| **Level 0** | none | 배경 요소, 인라인 텍스트 |
| **Level 1** | `0 1px 3px rgba(62, 44, 30, 0.08)` | 카드, 헤더 |
| **Level 2** | `0 4px 12px rgba(62, 44, 30, 0.12)` | 카드 호버, 드롭다운 |
| **Level 3** | `0 8px 24px rgba(62, 44, 30, 0.16)` | 모달, 플로팅 패널 |
| **Focus** | `0 0 0 3px rgba(43, 76, 126, 0.2)` | 포커스 링 |

Border 사용 원칙:
- 카드: 항상 1px solid border
- 구분선: 1px solid, 더 연한 border-light 사용
- 강조: 좌측 4px solid (검색 결과 카드 호버, 법조문 인용)

---

## 7. Do's and Don'ts

### Do's ✓

- **여백을 아끼지 말 것** — 법조문은 빽빽하면 읽기 어렵다. 넉넉한 line-height(1.6~1.8)
- **세리프 → 산세리프 조합** — 제목(Noto Serif KR)과 본문(Pretendard) 대비로 계층감
- **절제된 색상** — Primary Blue 외 색상은 상태 표시(성공/에러/수정)에만 사용
- **카드 테두리 유지** — 카드에는 항상 border + subtle shadow, 그림자만으로 구분하지 않음
- **명확한 인터랙션 피드백** — 호버, 포커스, 활성 상태 모두 구분 가능하게
- **법률 데이터의 출처 표시** — 하단에 "법제처 Open API 기반" 항상 표기

### Don'ts ✗

- **절대 네온/비비드 색상 사용 금지** — 법률 서비스에 어울리지 않음
- **그래디언트 남용 금지** — 히어로 배경 정도만 허용, 버튼에는 플랫 컬러
- **이모지 과다 사용 금지** — 아이콘은 1~2개만, 장식용 이모지 금지
- **다크 모드 없음** — 공공서비스 특성상 밝은 모드 단일 유지
- **자동 재생 애니메이션 금지** — 법조문을 읽는 맥락에서 산만함 방지
- **텍스트 색상에 회색 이하 사용 금지** — WCAG AA 대비비 4.5:1 이상 유지

---

## 8. Responsive Behavior

### Breakpoints

| Name | Min Width | Layout |
|------|-----------|--------|
| **Mobile** | 0px | 단일 열, 햄버거 메뉴, 48px 터치 타겟 |
| **Tablet** | 768px | 2열 그리드, 축소된 네비게이션 |
| **Desktop** | 1024px | 전체 네비게이션, 3열 그리드 |
| **Wide** | 1280px | 최대 컨텐츠 폭, 사이드 여백 증가 |

### Collapse Strategy

- **히어로 검색바**: 100% 폭 유지, 패딩 축소
- **기능 카드**: 3열 → 2열 → 1열
- **신구대조**: 양쪽 분할 → 탭 전환 (모바일)
- **법조문 아코디언**: 들여쓰기 축소 (32px → 16px)
- **네비게이션**: 전체 표시 → 햄버거 메뉴
- **검색 필터**: 인라인 → 접이식 패널

### Touch Targets

- 최소 44px × 44px (WCAG 2.5.5)
- 모바일 버튼: 48px 높이
- 링크 사이 최소 간격: 8px

---

## 9. Agent Prompt Guide

### Quick Color Reference

```
bg-page:     #F5F0EB (파치먼트)
bg-card:     #FFFFFF (흰색)
bg-muted:    #FAF8F5 (연한 파치먼트)
bg-primary:  #2B4C7E (정의 파란색)
bg-primary-light: #E8EEF5 (연한 파란색)
text-heading: #3E2C1E (오크)
text-body:    #6B7B8D (회색)
text-primary: #2B4C7E (파란색)
border:       #D5CFC7 (따뜻한 회색)
border-light: #E8E3DC (연한 회색)
success:      #27AE60
error:        #C0392B
warning:      #F39C12
```

### Ready-to-Use Prompts

**법령 검색 결과 카드 생성:**
> "법령 검색 결과 카드를 만들어줘. 좌측에 법종류 배지, 법령명은 H4 Noto Serif KR, 소관부처와 시행일은 caption 사이즈, 호버 시 왼쪽 파란 보더 4px"

**법조문 아코디언 생성:**
> "법조문 아코디언 컴포넌트를 만들어줘. 장/조 계층, 펼침 시 법조문은 D2Coding 15px line-height 1.8, 들여쓰기 32px, 왼쪽 border-light 2px"

**히어로 섹션 생성:**
> "히어로 섹션을 만들어줘. 흰색→파치먼트 그래디언트 배경, Noto Serif KR 900 48px 타이틀, 가운데 정렬 검색바 56px 높이, 하단에 키워드 pill 버튼들"

### Component Naming Convention

```
Layout:  Header, Footer, Navigation
Pages:   HomePage, SearchPage, LawDetailPage, PrecedentPage, ComparePage
Cards:   LawCard, PrecedentCard, FeatureCard
Forms:   SearchBar, SearchFilters, Autocomplete
Display: Badge, Accordion, TabBar, Pagination, Loading
Compare: CompareView, DiffHighlight, Timeline
```
