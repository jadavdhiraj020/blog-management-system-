import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const timestamp = new Date().toISOString();
  console.log(`[Proxy] ${timestamp} — ${pathname}`);

  const authorCookie = request.cookies.get("blog_author");
  if (!authorCookie || !authorCookie.value) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("error", "login_required");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
