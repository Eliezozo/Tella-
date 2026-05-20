"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  authFormInitialState,
  registerTailorAction,
} from "@/actions/auth-actions";
import { FormField } from "@/components/auth/form-field";

function fieldError(
  fieldErrors: Record<string, string[]> | undefined,
  key: string,
): string | undefined {
  return fieldErrors?.[key]?.[0];
}

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(
    registerTailorAction,
    authFormInitialState,
  );

  return (
    <form action={formAction} className="mt-8">
      {state.message && !state.ok ? (
        <p
          role="alert"
          className="mb-4 rounded-md border border-primary/30 bg-primary-soft px-4 py-3 text-sm text-primary"
        >
          {state.message}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Nom de l'atelier"
          name="atelierName"
          placeholder="Atelier Ama"
          error={fieldError(state.fieldErrors, "atelierName")}
          className="sm:col-span-1"
        />
        <FormField
          label="Ville"
          name="city"
          placeholder="Lomé"
          error={fieldError(state.fieldErrors, "city")}
        />
        <FormField
          label="Email professionnel"
          name="email"
          type="email"
          placeholder="contact@atelier.tg"
          error={fieldError(state.fieldErrors, "email")}
          className="sm:col-span-2"
        />
        <FormField
          label="Numéro WhatsApp"
          name="whatsapp"
          placeholder="+228 90 00 00 01"
          error={fieldError(state.fieldErrors, "whatsapp")}
        />
        <FormField
          label="Mot de passe"
          name="password"
          type="password"
          placeholder="8 caractères minimum"
          error={fieldError(state.fieldErrors, "password")}
        />
        <FormField
          label="Spécialités"
          name="specialties"
          placeholder="Robes, Mariage, Traditionnel"
          error={fieldError(state.fieldErrors, "specialties")}
          className="sm:col-span-2"
        />
        <FormField
          label="Description"
          name="description"
          error={fieldError(state.fieldErrors, "description")}
          className="sm:col-span-2"
        >
          <textarea
            name="description"
            rows={4}
            placeholder="Présentez votre atelier, votre style et votre zone de livraison."
            required
            className="mt-2 w-full rounded-md border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
          />
        </FormField>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-8 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold tracking-wide text-on-primary hover:bg-primary-strong disabled:opacity-60"
      >
        {isPending ? "Création en cours…" : "Créer mon atelier"}
      </button>

      <p className="mt-4 text-center text-sm text-muted">
        Déjà inscrite ?{" "}
        <Link href="/login" className="font-semibold text-primary hover:text-primary-strong">
          Se connecter
        </Link>
      </p>
    </form>
  );
}
