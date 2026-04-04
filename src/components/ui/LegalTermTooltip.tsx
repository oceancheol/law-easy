"use client";

import { useState } from "react";

interface LegalTermTooltipProps {
  term: string;
  definition: string;
  children: React.ReactNode;
}

export default function LegalTermTooltip({
  term,
  definition,
  children,
}: LegalTermTooltipProps) {
  const [show, setShow] = useState(false);

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span className="border-b border-dashed border-[var(--primary)] cursor-help">
        {children}
      </span>
      {show && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-[var(--foreground)] text-white text-xs rounded-lg shadow-lg">
          <p className="font-semibold mb-1">{term}</p>
          <p className="leading-relaxed">{definition}</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-[var(--foreground)] rotate-45 -mt-1" />
        </div>
      )}
    </span>
  );
}

const LEGAL_TERMS: Record<string, string> = {
  "선고": "법원이 재판의 내용을 당사자에게 알리는 행위",
  "판시": "법원이 판결에서 판단하여 나타낸 사항",
  "상고": "하급법원의 판결에 대해 대법원에 불복하여 상소하는 것",
  "항소": "제1심 판결에 대해 제2심 법원에 불복하여 상소하는 것",
  "원고": "민사소송에서 소를 제기한 당사자",
  "피고": "민사소송에서 소를 당한 당사자",
  "피고인": "형사소송에서 공소가 제기된 사람",
  "공소": "검사가 법원에 형사사건의 심판을 요구하는 행위",
  "기각": "법원이 청구나 신청이 이유 없다고 판단하여 배척하는 재판",
  "각하": "소송 요건을 갖추지 못한 경우 본안 심리 없이 소를 배척하는 재판",
  "인용": "법원이 청구의 전부 또는 일부를 받아들이는 재판",
  "파기환송": "상급법원이 하급법원의 판결을 깨뜨리고 다시 재판하도록 돌려보내는 것",
  "부칙": "법령의 시행일, 경과조치 등을 규정하는 부분",
  "소멸시효": "일정 기간 권리를 행사하지 않으면 권리가 소멸하는 제도",
  "선의": "법률에서 어떤 사실을 알지 못하는 상태",
  "악의": "법률에서 어떤 사실을 알고 있는 상태",
  "제척기간": "권리의 존속 기간으로, 기간이 지나면 권리 자체가 소멸",
  "시행령": "법률의 위임을 받아 대통령이 제정하는 명령",
  "시행규칙": "법률이나 시행령의 위임을 받아 부처 장관이 제정하는 명령",
};

export function getLegalTermDefinition(term: string): string | undefined {
  return LEGAL_TERMS[term];
}

export function getAllLegalTerms(): Record<string, string> {
  return { ...LEGAL_TERMS };
}
