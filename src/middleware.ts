import { NextResponse } from "next/server";

import { auth } from "@/auth";

export default auth((req) => {
  const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");

  if (isDashboard && !req.auth) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (
    (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/register") &&
    req.auth
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
