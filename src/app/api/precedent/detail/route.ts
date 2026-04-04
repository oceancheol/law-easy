import { NextRequest, NextResponse } from "next/server";
import { getPrecedentDetail } from "@/lib/api/lawApi";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get("id") || "";

  if (!id) {
    return NextResponse.json({
      success: false,
      data: null,
      error: "판례 ID가 필요합니다.",
    });
  }

  const detail = await getPrecedentDetail(id);
  return NextResponse.json({
    success: !!detail,
    data: detail,
    error: detail ? undefined : "판례 정보를 불러올 수 없습니다.",
  });
}
