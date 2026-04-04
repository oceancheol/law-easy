import { NextRequest, NextResponse } from "next/server";
import { getLawDetail } from "@/lib/api/lawApi";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get("id") || "";

  if (!id) {
    return NextResponse.json({
      success: false,
      data: null,
      error: "법령 ID가 필요합니다.",
    });
  }

  const detail = await getLawDetail(id);
  return NextResponse.json({
    success: !!detail,
    data: detail,
    error: detail ? undefined : "법령 정보를 불러올 수 없습니다.",
  });
}
