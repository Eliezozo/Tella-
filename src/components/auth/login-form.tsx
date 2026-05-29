"use client";

import Link from "next/link";
import { useActionState } from "react";

import { loginAction } from "@/actions/auth-actions";
import { authFormInitialState } from "@/lib/auth-form-state";
import { FormAlert } from "@/components/auth/form-alert";
import { FormField } from "@/components/auth/form-field";

function fieldError(
  fieldErrors: Record<string, string[]> | undefined,
  key: string,
): string | undefined {
  return fieldErrors?.[key]?.[0];
}

export function LoginForm({
  callbackUrl = "/dashboard",
  demoHint,
}: {
  callbackUrl?: string;
  demoHint?: string | null;
}) {
  const [state, formAction, isPending] = useActionState(loginAction, authFormInitialState);

  return (
    <form action={formAction} className="mt-8">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      {demoHint ? (
        <p className="mb-4 rounded-md border border-border bg-surface px-4 py-3 text-xs text-muted">
          {demoHint}
        </p>
      ) : null}

      {state.message && !state.ok ? (
        <FormAlert
          variant={
            /attente|validation|approbation/i.test(state.message) ? "info" : "error"
          }
        >
          {state.message}
        </FormAlert>
      ) : null}

      <div className="space-y-4">
        <FormField
          label="Email ou téléphone"
          name="identifier"
          placeholder="exemple@email.com"
          error={fieldError(state.fieldErrors, "identifier")}
        />
        <FormField
          label="Mot de passe"
          name="password"
          type="password"
          placeholder="••••••••"
          error={fieldError(state.fieldErrors, "password")}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-8 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold tracking-wide text-on-primary hover:bg-primary-strong disabled:opacity-60"
      >
        {isPending ? "Connexion…" : "Se connecter"}
      </button>

      <p className="mt-4 text-center text-sm text-muted">
        Pas encore de compte ?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary hover:text-primary-strong"
        >
          Créer mon atelier
        </Link>
      </p>
    </form>
  );
}
