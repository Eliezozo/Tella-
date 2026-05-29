"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";

import { createCreationAction } from "@/actions/creation-actions";
import { FormAlert } from "@/components/auth/form-alert";
import { FormField } from "@/components/auth/form-field";
import { categoryLabels, categoryKeys } from "@/lib/constants/categories";
import { creationFormInitialState } from "@/lib/creation-form-state";
import {
  CREATION_IMAGE_MAX_BYTES,
  CREATION_IMAGE_MAX_MB,
} from "@/lib/creation-image-limits";
import { creationSizeOptions } from "@/lib/validations/creation";
import { cn } from "@/lib/utils";

const inputClassName =
  "mt-2 w-full rounded-md border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary";

const TURNAROUND_OPTIONS = ["3 jours", "5 jours", "7 jours", "10 jours", "14 jours", "Sur mesure"];

function fieldError(
  errors: Record<string, string[]> | undefined,
  key: string,
): string | undefined {
  return errors?.[key]?.[0];
}

export function CreationForm() {
  const [state, formAction, isPending] = useActionState(
    createCreationAction,
    creationFormInitialState,
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(["S", "M", "L"]);

  const mergedPreview = useMemo(() => previewUrl, [previewUrl]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setPreviewUrl(null);
      setFileError(null);
      return;
    }

    if (file.size > CREATION_IMAGE_MAX_BYTES) {
      setFileError(
        `Image trop lourde (max ${CREATION_IMAGE_MAX_MB} Mo). Compressez-la ou utilisez un lien URL.`,
      );
      event.target.value = "";
      setPreviewUrl(null);
      return;
    }

    setFileError(null);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function toggleSize(size: string) {
    setSelectedSizes((current) =>
      current.includes(size) ? current.filter((item) => item !== size) : [...current, size],
    );
  }

  return (
    <form action={formAction} className="mt-8 space-y-6">
      {state.message && !state.ok ? (
        <FormAlert variant="error">{state.message}</FormAlert>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <FormField
            label="Titre de la pièce"
            name="title"
            placeholder="Robe cérémonie corail"
            error={fieldError(state.fieldErrors, "title")}
            required={false}
          />
          <FormField
            label="Catégorie"
            name="category"
            error={fieldError(state.fieldErrors, "category")}
            required={false}
          >
            <select name="category" defaultValue="" className={inputClassName}>
              <option value="" disabled>
                Choisir une catégorie
              </option>
              {categoryKeys.map((key) => (
                <option key={key} value={key}>
                  {categoryLabels[key]}
                </option>
              ))}
            </select>
          </FormField>
          <FormField
            label="Description"
            name="description"
            error={fieldError(state.fieldErrors, "description")}
            required={false}
          >
            <textarea
              name="description"
              rows={4}
              placeholder="Style, occasion, finitions, ce qui rend cette pièce unique…"
              className={inputClassName}
            />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Prix à partir de (FCFA)"
              name="priceFrom"
              type="number"
              placeholder="45000"
              error={fieldError(state.fieldErrors, "priceFrom")}
              required={false}
            />
            <FormField
              label="Délai de réalisation"
              name="turnaroundLabel"
              error={fieldError(state.fieldErrors, "turnaroundLabel")}
              required={false}
            >
              <select name="turnaroundLabel" defaultValue="7 jours" className={inputClassName}>
                {TURNAROUND_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </FormField>
          </div>
        </div>

        <div className="space-y-4">
          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              Photo principale *
            </legend>
            <p className="mt-1 text-xs text-muted">
              Importez une image (JPG, PNG, WebP — max {CREATION_IMAGE_MAX_MB} Mo) ou collez un
              lien public.
            </p>
            <div className="mt-3 space-y-3">
              <input
                type="file"
                name="imageFile"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="block w-full text-sm text-muted file:mr-3 file:rounded-md file:border-0 file:bg-primary-soft file:px-3 file:py-2 file:text-sm file:font-semibold file:text-primary"
              />
              {fileError ? <p className="mt-2 text-xs text-danger">{fileError}</p> : null}
              <FormField
                label="Ou lien de l'image"
                name="imageUrl"
                placeholder="https://…"
                error={fieldError(state.fieldErrors, "imageUrl")}
                required={false}
              />
            </div>
          </fieldset>

          {mergedPreview ? (
            <div className="illustration-frame relative aspect-[4/5] w-full max-w-xs overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={mergedPreview} alt="Aperçu" className="h-full w-full object-cover" />
            </div>
          ) : null}

          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              Tailles disponibles *
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {creationSizeOptions.map((size) => (
                <label
                  key={size}
                  className={cn(
                    "inline-flex cursor-pointer items-center rounded-md border px-3 py-2 text-sm",
                    selectedSizes.includes(size)
                      ? "border-primary bg-primary-soft text-primary"
                      : "border-border bg-background text-muted",
                  )}
                >
                  <input
                    type="checkbox"
                    name="sizes"
                    value={size}
                    checked={selectedSizes.includes(size)}
                    onChange={() => toggleSize(size)}
                    className="sr-only"
                  />
                  {size}
                </label>
              ))}
            </div>
            {fieldError(state.fieldErrors, "sizes") ? (
              <p className="mt-2 text-xs text-danger">{fieldError(state.fieldErrors, "sizes")}</p>
            ) : null}
          </fieldset>

          <FormField
            label="Détails (un par ligne, optionnel)"
            name="detailsText"
            error={fieldError(state.fieldErrors, "detailsText")}
            required={false}
          >
            <textarea
              name="detailsText"
              rows={4}
              placeholder={"Corail doux\nManches longues\nFinition main"}
              className={inputClassName}
            />
          </FormField>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/dashboard/creations"
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-md border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-foreground hover:border-primary"
        >
          Annuler
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold tracking-wide text-on-primary hover:bg-primary-strong disabled:opacity-60"
        >
          {isPending ? "Publication…" : "Publier dans ma collection"}
        </button>
      </div>
    </form>
  );
}
