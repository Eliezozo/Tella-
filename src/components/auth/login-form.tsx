"use client";

import Link from "next/link";
import { useActionState, useRef } from "react";

import { loginAction } from "@/actions/auth-actions";
import { authFormInitialState } from "@/lib/auth-form-state";
import { FormField } from "@/components/auth/form-field";

function fieldError(
  fieldErrors: Record<string, string[]> | undefined,
  key: string,
): string | undefined {
  return fieldErrors?.[key]?.[0];
}

const DEMO_EMAIL = "ama@tella.tg";
const DEMO_PASSWORD = "TellaDemo2026";

export function LoginForm({
  callbackUrl = "/dashboard",
  demoHint,
}: {
  callbackUrl?: string;
  demoHint?: string | null;
}) {
  const [state, formAction, isPending] = useActionState(loginAction, authFormInitialState);
  const formRef = useRef<HTMLFormElement>(null);

  function fillDemoAndSubmit() {
    const form = formRef.current;
    if (!form) return;
    const identifier = form.elements.namedItem("identifier") as HTMLInputElement | null;
    const password = form.elements.namedItem("password") as HTMLInputElement | null;
    if (identifier) identifier.value = DEMO_EMAIL;
    if (password) password.value = DEMO_PASSWORD;
    form.requestSubmit();
  }

  return (
    <form ref={formRef} action={formAction} className="mt-8">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      {demoHint ? (
        <p className="mb-4 rounded-md border border-border bg-surface px-4 py-3 text-xs text-muted">
          {demoHint}
        </p>
      ) : null}

      {state.message && !state.ok ? (
        <p
          role="alert"
          className="mb-4 rounded-md border border-primary/30 bg-primary-soft px-4 py-3 text-sm text-primary"
        >
          {state.message}
        </p>
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

      {demoHint ? (
        <button
          type="button"
          disabled={isPending}
          onClick={fillDemoAndSubmit}
          className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-md border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-foreground hover:border-primary hover:text-primary disabled:opacity-60"
        >
          Connexion démo (Atelier Ama)
        </button>
      ) : null}

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
