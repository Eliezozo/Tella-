import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: "CLIENT" | "TAILOR" | "ADMIN";
      tailorProfileId: string | null;
      handle: string | null;
    };
  }

  interface User {
    id: string;
    role: "CLIENT" | "TAILOR" | "ADMIN";
    tailorProfileId: string | null;
    handle: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "CLIENT" | "TAILOR" | "ADMIN";
    tailorProfileId: string | null;
    handle: string | null;
  }
}
