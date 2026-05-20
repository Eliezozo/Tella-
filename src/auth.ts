import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { authenticateUser } from "@/services/auth-service";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  trustHost: true,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        identifier: { label: "Email ou téléphone", type: "text" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        const identifier = credentials?.identifier;
        const password = credentials?.password;

        if (typeof identifier !== "string" || typeof password !== "string") {
          return null;
        }

        try {
          const user = await authenticateUser({ identifier, password });
          return {
            id: user.id,
            email: user.email ?? undefined,
            name: user.name ?? undefined,
            role: user.role,
            tailorProfileId: user.tailorProfileId,
            handle: user.handle,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
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
});
