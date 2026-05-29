"use client";

import Link from "next/link";
import { startTransition, useActionState, useEffect, useMemo, useRef, useState } from "react";

import { registerTailorAction } from "@/actions/auth-actions";
import { RegisterSuccess } from "@/components/auth/register-success";
import { FormAlert } from "@/components/auth/form-alert";
import { FormField } from "@/components/auth/form-field";
import { categoryLabels } from "@/lib/constants/categories";
import { togoCities } from "@/lib/constants/cities";
import { authFormInitialState } from "@/lib/auth-form-state";
import { slugifyHandle } from "@/lib/handle";
import {
  emptyRegisterDraft,
  mergeRegisterDraft,
  registerPayloadToFormData,
  toRegisterPayload,
  type RegisterDraft,
} from "@/lib/register-draft";
import { registerTailorSchema } from "@/lib/validations/auth";
import {
  registerStep1Schema,
  registerStep2Schema,
  registerStep3Schema,
} from "@/lib/validations/register-steps";
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
  errors: Record<string, string[]> | undefined,
  key: string,
): string | undefined {
  return errors?.[key]?.[0];
}

function flattenZodErrors(
  fieldErrors: Record<string, string[] | undefined>,
): Record<string, string[]> {
  const entries = Object.entries(fieldErrors).filter(
    (entry): entry is [string, string[]] =>
      Array.isArray(entry[1]) && entry[1].length > 0,
  );
  return Object.fromEntries(entries);
}

function stepSchemaFor(targetStep: number) {
  if (targetStep === 1) return registerStep1Schema;
  if (targetStep === 2) return registerStep2Schema;
  return registerStep3Schema;
}

export function RegisterForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<RegisterDraft>(emptyRegisterDraft);
  const [stepErrors, setStepErrors] = useState<Record<string, string[]> | undefined>();
  const [state, formAction, isPending] = useActionState(
    registerTailorAction,
    authFormInitialState,
  );

  const handlePreview = useMemo(
    () =>
      draft.atelierName.trim().length >= 2
        ? slugifyHandle(draft.atelierName)
        : "@atelier",
    [draft.atelierName],
  );

  const mergedErrors = state.fieldErrors ?? stepErrors;

  const displayStep = useMemo(() => {
    if (!state.fieldErrors) return step;
    const firstField = Object.keys(state.fieldErrors)[0];
    const targetStep = firstField ? FIELD_STEP[firstField] : undefined;
    return targetStep ?? step;
  }, [state.fieldErrors, step]);

  useEffect(() => {
    if (state.ok && state.pendingApproval) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [state.ok, state.pendingApproval]);

  if (state.ok && state.pendingApproval) {
    return (
      <RegisterSuccess
        atelierName={state.registeredAtelierName ?? "Votre atelier"}
        handle={state.registeredHandle ?? "@atelier"}
        email={state.registeredEmail ?? ""}
        message={state.message}
      />
    );
  }

  function readPayloadFromForm(): RegisterDraft {
    const form = formRef.current;
    if (!form) return draft;
    const payload = toRegisterPayload(draft, new FormData(form));
    return { ...payload, heroLabel: payload.heroLabel ?? "" };
  }

  function validateStep(targetStep: number, payload: RegisterDraft): boolean {
    const result = stepSchemaFor(targetStep).safeParse(payload);
    if (!result.success) {
      setStepErrors(flattenZodErrors(result.error.flatten().fieldErrors));
      return false;
    }
    setStepErrors(undefined);
    return true;
  }

  function validateAllSteps(): boolean {
    const payload = readPayloadFromForm();
    const result = registerTailorSchema.safeParse(payload);
    if (!result.success) {
      const errors = flattenZodErrors(result.error.flatten().fieldErrors);
      setStepErrors(errors);
      const firstField = Object.keys(errors)[0];
      if (firstField && FIELD_STEP[firstField]) {
        setStep(FIELD_STEP[firstField]);
      }
      return false;
    }
    setDraft({
      ...payload,
      heroLabel: payload.heroLabel ?? "",
    });
    setStepErrors(undefined);
    return true;
  }

  function goNext() {
    const payload = readPayloadFromForm();
    if (!validateStep(displayStep, payload)) {
      return;
    }
    setDraft(payload);
    setStep((current) => Math.min(3, current + 1));
  }

  function goBack() {
    const payload = readPayloadFromForm();
    setDraft(payload);
    setStepErrors(undefined);
    setStep((current) => Math.max(1, current - 1));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateAllSteps()) {
      return;
    }
    const payload = readPayloadFromForm();
    startTransition(() => {
      formAction(registerPayloadToFormData(payload));
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="mt-8" noValidate>

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
        <FormAlert variant="error">{state.message}</FormAlert>
      ) : null}

      {stepErrors && Object.keys(stepErrors).length > 0 && !state.ok ? (
        <FormAlert variant="error" className="mt-0">
          Corrigez les champs en rouge ci-dessous avant de continuer.
        </FormAlert>
      ) : null}

      {displayStep === 1 ? (
        <div className="space-y-4">
          <p className="text-sm text-muted">
            Étape 1 — Présentez votre atelier. Votre identifiant public sera généré
            automatiquement.
          </p>
          <FormField
            label="Nom de l'atelier"
            name="atelierName"
            error={fieldError(mergedErrors, "atelierName")}
            required={false}
          >
            <input
              name="atelierName"
              value={draft.atelierName}
              onChange={(event) =>
                setDraft((current) =>
                  mergeRegisterDraft(current, { atelierName: event.target.value }),
                )
              }
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
            error={fieldError(mergedErrors, "city")}
            required={false}
          >
            <select
              name="city"
              value={draft.city}
              onChange={(event) =>
                setDraft((current) => mergeRegisterDraft(current, { city: event.target.value }))
              }
              className={inputClassName}
            >
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
            error={fieldError(mergedErrors, "heroLabel")}
            required={false}
          >
            <input
              name="heroLabel"
              value={draft.heroLabel}
              onChange={(event) =>
                setDraft((current) =>
                  mergeRegisterDraft(current, { heroLabel: event.target.value }),
                )
              }
              className={inputClassName}
            />
          </FormField>
        </div>
      ) : null}

      {displayStep === 2 ? (
        <div className="space-y-4">
          <p className="text-sm text-muted">
            Étape 2 — Coordonnées et accès. Ces informations servent à la connexion et au
            contact WhatsApp.
          </p>
          <FormField
            label="Email professionnel"
            name="email"
            type="email"
            placeholder="contact@atelier.tg"
            error={fieldError(mergedErrors, "email")}
            required={false}
          >
            <input
              name="email"
              type="email"
              value={draft.email}
              onChange={(event) =>
                setDraft((current) => mergeRegisterDraft(current, { email: event.target.value }))
              }
              className={inputClassName}
            />
          </FormField>
          <FormField
            label="Numéro WhatsApp"
            name="whatsapp"
            placeholder="+228 90 00 00 01"
            error={fieldError(mergedErrors, "whatsapp")}
            required={false}
          >
            <input
              name="whatsapp"
              value={draft.whatsapp}
              onChange={(event) =>
                setDraft((current) =>
                  mergeRegisterDraft(current, { whatsapp: event.target.value }),
                )
              }
              className={inputClassName}
            />
          </FormField>
          <FormField
            label="Mot de passe"
            name="password"
            type="password"
            placeholder="8 caractères minimum"
            error={fieldError(mergedErrors, "password")}
            required={false}
          >
            <input
              name="password"
              type="password"
              value={draft.password}
              onChange={(event) =>
                setDraft((current) =>
                  mergeRegisterDraft(current, { password: event.target.value }),
                )
              }
              className={inputClassName}
            />
          </FormField>
          <FormField
            label="Confirmer le mot de passe"
            name="passwordConfirm"
            type="password"
            placeholder="Répétez le mot de passe"
            error={fieldError(mergedErrors, "passwordConfirm")}
            required={false}
          >
            <input
              name="passwordConfirm"
              type="password"
              value={draft.passwordConfirm}
              onChange={(event) =>
                setDraft((current) =>
                  mergeRegisterDraft(current, { passwordConfirm: event.target.value }),
                )
              }
              className={inputClassName}
            />
          </FormField>
        </div>
      ) : null}

      {displayStep === 3 ? (
        <div className="space-y-4">
          <p className="text-sm text-muted">
            Étape 3 — Décrivez votre savoir-faire (minimum 20 caractères). Cochez au moins
            une spécialité et acceptez les conditions.
          </p>
          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              Spécialités *
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
                    defaultChecked={draft.specialties.includes(label)}
                    className="accent-primary"
                  />
                  {label}
                </label>
              ))}
            </div>
            {fieldError(mergedErrors, "specialties") ? (
              <p className="mt-2 text-xs text-danger">
                {fieldError(mergedErrors, "specialties")}
              </p>
            ) : null}
          </fieldset>
          <FormField
            label="Description de l'atelier"
            name="description"
            error={fieldError(mergedErrors, "description")}
            required={false}
          >
            <textarea
              name="description"
              rows={5}
              defaultValue={draft.description}
              placeholder="Style, types de tenues, délais, zone de livraison… (min. 20 caractères)"
              className={inputClassName}
            />
          </FormField>
          <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border bg-background px-4 py-3">
            <input
              type="checkbox"
              name="acceptTerms"
              defaultChecked={draft.acceptTerms}
              className="mt-0.5 accent-primary"
            />
            <span className="text-sm leading-6 text-muted">
              J&apos;accepte que Tella vérifie mon inscription avant activation du compte
              et de la visibilité publique de mon atelier. *
            </span>
          </label>
          {fieldError(mergedErrors, "acceptTerms") ? (
            <p className="text-xs text-danger">{fieldError(mergedErrors, "acceptTerms")}</p>
          ) : null}
        </div>
      ) : null}

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
