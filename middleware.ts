import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Public website routing. The admin portal lives on the Laravel backend (cPanel),
 * so this Vercel frontend only serves public CMS pages under /public/*.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/public") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next")
  ) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? "/public/home" : `/public${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
