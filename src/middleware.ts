import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/") {
    return NextResponse.redirect(new URL('/warps', request.url))
  }
  return NextResponse.next();
}
 
export const config = {
  matcher: [
    "/",
  ],
};
