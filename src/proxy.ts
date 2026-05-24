import NextAuth from "next-auth";
import { NextResponse } from "next/server";

import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

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

  if (req.nextUrl.pathname === "/" && req.auth?.user?.role === "TAILOR") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
  }

  if (req.nextUrl.pathname === "/" && req.auth?.user?.role === "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard/demandes", req.nextUrl.origin));
  }
});

export const config = {
  matcher: ["/", "/dashboard/:path*", "/login", "/register"],
};
