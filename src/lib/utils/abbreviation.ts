const ABBREVIATIONS: Record<string, string> = {
  "화관법": "화학물질관리법",
  "화평법": "화학물질의 등록 및 평가 등에 관한 법률",
  "산안법": "산업안전보건법",
  "근기법": "근로기준법",
  "민소법": "민사소송법",
  "형소법": "형사소송법",
  "상증법": "상속세 및 증여세법",
  "소득법": "소득세법",
  "법인법": "법인세법",
  "부가법": "부가가치세법",
  "주택법": "주택법",
  "건축법": "건축법",
  "도교법": "도로교통법",
  "국토법": "국토의 계획 및 이용에 관한 법률",
  "개보법": "개인정보 보호법",
  "전안법": "전기·전자제품 및 자동차의 자원순환에 관한 법률",
  "중처법": "중대재해 처벌 등에 관한 법률",
};

export function resolveAbbreviation(query: string): string {
  return ABBREVIATIONS[query] || query;
}

export function getAllAbbreviations(): Record<string, string> {
  return { ...ABBREVIATIONS };
}
