"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";

import { registerTailorAction } from "@/actions/auth-actions";
import { RegisterSuccess } from "@/components/auth/register-success";
import { FormField } from "@/components/auth/form-field";
import { categoryLabels } from "@/lib/constants/categories";
import { togoCities } from "@/lib/constants/cities";
import { authFormInitialState } from "@/lib/auth-form-state";
import { slugifyHandle } from "@/lib/handle";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Atelier" },
  { id: 2, label: "Contact" },
  { id: 3, label: "Vitrine" },
] as const;

const FIELD_STEP: Record<string, number> = {
  atelierName: 1,
  city: 1,
  heroLabel: 1,
  email: 2,
  whatsapp: 2,
  password: 2,
  passwordConfirm: 2,
  specialties: 3,
  description: 3,
  acceptTerms: 3,
};

const inputClassName =
  "mt-2 w-full rounded-md border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary";

function fieldError(
  fieldErrors: Record<string, string[]> | undefined,
  key: string,
): string | undefined {
  return fieldErrors?.[key]?.[0];
}

export function RegisterForm() {
  const [step, setStep] = useState(1);
  const [atelierName, setAtelierName] = useState("");
  const [state, formAction, isPending] = useActionState(
    registerTailorAction,
    authFormInitialState,
  );

  const handlePreview = useMemo(
    () => (atelierName.trim().length >= 2 ? slugifyHandle(atelierName) : "@atelier"),
    [atelierName],
  );

  const displayStep = useMemo(() => {
    if (!state.fieldErrors) return step;
    const firstField = Object.keys(state.fieldErrors)[0];
    const targetStep = firstField ? FIELD_STEP[firstField] : undefined;
    return targetStep ?? step;
  }, [state.fieldErrors, step]);

  if (state.ok && state.pendingApproval && state.registeredHandle) {
    return (
      <RegisterSuccess
        atelierName={state.registeredAtelierName ?? "Votre atelier"}
        handle={state.registeredHandle}
        email={state.registeredEmail ?? ""}
      />
    );
  }

  function goNext() {
    setStep((current) => Math.min(3, current + 1));
  }

  function goBack() {
    setStep((current) => Math.max(1, current - 1));
  }

  return (
    <form action={formAction} className="mt-8">
      <nav aria-label="Étapes d'inscription" className="mb-8">
        <ol className="flex gap-2">
          {STEPS.map((item) => (
            <li key={item.id} className="flex-1">
              <div
                className={cn(
                  "rounded-md px-2 py-2 text-center text-xs font-semibold uppercase tracking-wide",
                  displayStep === item.id
                    ? "bg-primary text-on-primary"
                    : displayStep > item.id
                      ? "bg-primary-soft text-primary"
                      : "bg-surface text-muted",
                )}
              >
                {item.label}
              </div>
            </li>
          ))}
        </ol>
      </nav>

      {state.message && !state.ok ? (
        <p
          role="alert"
          className="mb-4 rounded-md border border-primary/30 bg-primary-soft px-4 py-3 text-sm text-primary"
        >
          {state.message}
        </p>
      ) : null}

      <div className={cn("space-y-4", displayStep !== 1 && "hidden")} aria-hidden={displayStep !== 1}>
          <p className="text-sm text-muted">
            Étape 1 — Présentez votre atelier. Votre identifiant public sera généré
            automatiquement.
          </p>
          <FormField
            label="Nom de l'atelier"
            name="atelierName"
            placeholder="Atelier Ama"
            error={fieldError(state.fieldErrors, "atelierName")}
          >
            <input
              name="atelierName"
              required
              value={atelierName}
              onChange={(event) => setAtelierName(event.target.value)}
              placeholder="Atelier Ama"
              className={inputClassName}
            />
          </FormField>
          <p className="text-xs text-muted">
            Profil public prévu :{" "}
            <span className="font-semibold text-primary">{handlePreview}</span>
            <span className="text-muted"> (peut varier si le nom existe déjà)</span>
          </p>
          <FormField
            label="Ville"
            name="city"
            error={fieldError(state.fieldErrors, "city")}
          >
            <select name="city" required defaultValue="" className={inputClassName}>
              <option value="" disabled>
                Choisir une ville
              </option>
              {togoCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </FormField>
          <FormField
            label="Accroche (optionnel)"
            name="heroLabel"
            placeholder="Couture sur mesure pour cérémonies à Lomé"
            error={fieldError(state.fieldErrors, "heroLabel")}
          />
      </div>

      <div className={cn("space-y-4", displayStep !== 2 && "hidden")} aria-hidden={displayStep !== 2}>
          <p className="text-sm text-muted">
            Étape 2 — Coordonnées et accès. Ces informations servent à la connexion et au
            contact WhatsApp.
          </p>
          <FormField
            label="Email professionnel"
            name="email"
            type="email"
            placeholder="contact@atelier.tg"
            error={fieldError(state.fieldErrors, "email")}
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
            label="Confirmer le mot de passe"
            name="passwordConfirm"
            type="password"
            placeholder="Répétez le mot de passe"
            error={fieldError(state.fieldErrors, "passwordConfirm")}
          />
      </div>

      <div className={cn("space-y-4", displayStep !== 3 && "hidden")} aria-hidden={displayStep !== 3}>
          <p className="text-sm text-muted">
            Étape 3 — Décrivez votre savoir-faire. Votre profil restera privé jusqu&apos;à
            validation admin.
          </p>
          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              Spécialités
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {Object.values(categoryLabels).map((label) => (
                <label
                  key={label}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary-soft"
                >
                  <input
                    type="checkbox"
                    name="specialties"
                    value={label}
                    className="accent-primary"
                  />
                  {label}
                </label>
              ))}
            </div>
            {fieldError(state.fieldErrors, "specialties") ? (
              <p className="mt-2 text-xs text-primary">
                {fieldError(state.fieldErrors, "specialties")}
              </p>
            ) : null}
          </fieldset>
          <FormField
            label="Description de l'atelier"
            name="description"
            error={fieldError(state.fieldErrors, "description")}
          >
            <textarea
              name="description"
              rows={5}
              required
              placeholder="Style, types de tenues, délais, zone de livraison…"
              className={inputClassName}
            />
          </FormField>
          <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border bg-background px-4 py-3">
            <input
              type="checkbox"
              name="acceptTerms"
              required
              className="mt-0.5 accent-primary"
            />
            <span className="text-sm leading-6 text-muted">
              J&apos;accepte que Tella vérifie mon inscription avant activation du compte
              et de la visibilité publique de mon atelier.
            </span>
          </label>
          {fieldError(state.fieldErrors, "acceptTerms") ? (
            <p className="text-xs text-primary">
              {fieldError(state.fieldErrors, "acceptTerms")}
            </p>
          ) : null}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {displayStep > 1 ? (
          <button
            type="button"
            onClick={goBack}
            disabled={isPending}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-md border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-foreground hover:border-primary"
          >
            Retour
          </button>
        ) : null}
        {displayStep < 3 ? (
          <button
            type="button"
            onClick={goNext}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold tracking-wide text-on-primary hover:bg-primary-strong"
          >
            Continuer
          </button>
        ) : (
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold tracking-wide text-on-primary hover:bg-primary-strong disabled:opacity-60"
          >
            {isPending ? "Création en cours…" : "Créer mon atelier"}
          </button>
        )}
      </div>

      <p className="mt-4 text-center text-sm text-muted">
        Déjà inscrite ?{" "}
        <Link href="/login" className="font-semibold text-primary hover:text-primary-strong">
          Se connecter
        </Link>
      </p>
    </form>
  );
}
