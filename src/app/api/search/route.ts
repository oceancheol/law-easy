import { NextRequest, NextResponse } from "next/server";
import { searchLaws } from "@/lib/api/lawApi";
import { resolveAbbreviation } from "@/lib/utils/abbreviation";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const rawQuery = searchParams.get("q") || "";
  const page = Number(searchParams.get("page") || "1");
  const size = Number(searchParams.get("size") || "20");

  if (!rawQuery) {
    return NextResponse.json({
      success: false,
      data: [],
      error: "검색어를 입력해 주세요.",
      meta: { total: 0, page: 1, size: 20 },
    });
  }

  const query = resolveAbbreviation(rawQuery);
  const result = await searchLaws({ query, page, size });
  return NextResponse.json(result);
}
