import { NextRequest, NextResponse } from "next/server";
import { getAmendmentHistory, compareLawVersions } from "@/lib/api/lawApi";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const lawId = searchParams.get("lawId") || "";
  const date = searchParams.get("date") || "";

  if (!lawId) {
    return NextResponse.json({
      success: false,
      error: "법령 ID가 필요합니다.",
    });
  }

  const history = await getAmendmentHistory(lawId);
  const compare = await compareLawVersions(lawId, date || "");

  // date가 선택되면 해당 부칙 내용 찾기
  let amendmentContent: string[] = [];
  if (date && history) {
    const matched = history.amendments.find((a) => a.date === date);
    if (matched?.content) {
      amendmentContent = matched.content;
    }
  }

  return NextResponse.json({
    success: true,
    history,
    compare,
    amendmentContent,
  });
}
