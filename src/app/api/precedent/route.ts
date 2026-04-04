import { NextRequest, NextResponse } from "next/server";
import { searchPrecedents } from "@/lib/api/lawApi";
import type { CourtType } from "@/types/precedent";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q") || "";
  const page = Number(searchParams.get("page") || "1");
  const size = Number(searchParams.get("size") || "20");
  const court = (searchParams.get("court") || undefined) as CourtType | undefined;

  if (!query) {
    return NextResponse.json({
      success: false,
      data: [],
      error: "검색어를 입력해 주세요.",
      meta: { total: 0, page: 1, size: 20 },
    });
  }

  const result = await searchPrecedents({ query, page, size, court });
  return NextResponse.json(result);
}
