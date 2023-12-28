import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { serverGetWarpHistory } from "@/utils/warp-api";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const searchParams = new URL(request.url).searchParams;
  const resp = await serverGetWarpHistory(searchParams);
  return new NextResponse(JSON.stringify(resp), {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "Cache-Control": "s-maxage=86400",
    },
  });
}
