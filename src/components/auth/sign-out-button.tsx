"use client";

import { signOutAction } from "@/actions/auth-actions";

export function SignOutButton({ className }: { className?: string }) {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className={
          className ??
          "rounded-md px-3 py-2 text-sm font-medium text-muted hover:bg-primary-soft hover:text-primary"
        }
      >
        Déconnexion
      </button>
    </form>
  );
}
