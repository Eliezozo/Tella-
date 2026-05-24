import type { NextAuthConfig } from "next-auth";

/**
 * Config partagée NextAuth — sans providers ni accès DB.
 * Utilisée par le proxy (edge) pour éviter d’embarquer Prisma/bcrypt (> 1 Mo Vercel).
 */
export const authConfig = {
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.tailorProfileId = user.tailorProfileId ?? null;
        token.handle = user.handle ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "CLIENT" | "TAILOR" | "ADMIN";
        session.user.tailorProfileId = (token.tailorProfileId as string | null) ?? null;
        session.user.handle = (token.handle as string | null) ?? null;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
