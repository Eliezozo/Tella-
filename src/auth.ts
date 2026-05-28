import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { authConfig } from "@/auth.config";
import { authenticateUser } from "@/services/auth-service";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
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
        } catch (error) {
          // On log côté serveur pour diagnostic Vercel sans exposer le détail au client.
          if (error instanceof Error) {
            console.error("[auth.authorize] échec authentification:", error.message);
          } else {
            console.error("[auth.authorize] échec authentification inconnu:", error);
          }
          return null;
        }
      },
    }),
  ],
});
