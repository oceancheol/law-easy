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
  const compare = date ? await compareLawVersions(lawId, date) : null;

  return NextResponse.json({
    success: true,
    history,
    compare,
  });
}
