"use client";

import { useActionState, useMemo, useState } from "react";

import { updateProfileImagesAction } from "@/actions/profile-actions";
import { FormAlert } from "@/components/auth/form-alert";
import { OptimizedImage } from "@/components/ui/optimized-image";
import {
  CREATION_IMAGE_MAX_BYTES,
  CREATION_IMAGE_MAX_MB,
} from "@/lib/creation-image-limits";
import { profileFormInitialState } from "@/lib/profile-form-state";
import { cn } from "@/lib/utils";
import type { TailorProfile } from "@/types";

const inputClassName =
  "mt-2 w-full rounded-md border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none file:mr-3 file:rounded-md file:border-0 file:bg-primary-soft file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary";

type TailorProfileFormProps = {
  tailor: TailorProfile;
};

function fieldError(
  errors: Record<string, string[]> | undefined,
  key: string,
): string | undefined {
  return errors?.[key]?.[0];
}

export function TailorProfileForm({ tailor }: TailorProfileFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateProfileImagesAction,
    profileFormInitialState,
  );
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const avatarDisplay = useMemo(
    () => avatarPreview ?? tailor.avatarUrl ?? null,
    [avatarPreview, tailor.avatarUrl],
  );
  const bannerDisplay = useMemo(
    () => bannerPreview ?? tailor.coverUrl ?? null,
    [bannerPreview, tailor.coverUrl],
  );

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
    kind: "avatar" | "banner",
  ) {
    const file = event.target.files?.[0];
    if (!file) {
      if (kind === "avatar") setAvatarPreview(null);
      else setBannerPreview(null);
      setFileError(null);
      return;
    }

    if (file.size > CREATION_IMAGE_MAX_BYTES) {
      setFileError(
        `Image trop lourde (max ${CREATION_IMAGE_MAX_MB} Mo). Compressez-la avant l'envoi.`,
      );
      event.target.value = "";
      return;
    }

    setFileError(null);
    const preview = URL.createObjectURL(file);
    if (kind === "avatar") setAvatarPreview(preview);
    else setBannerPreview(preview);
  }

  const fields = [
    { label: "Nom de l'atelier", value: tailor.atelierName },
    { label: "Identifiant public", value: tailor.handle },
    { label: "Ville", value: tailor.city },
    { label: "Numéro WhatsApp", value: tailor.whatsapp },
    { label: "Accroche", value: tailor.heroLabel },
    { label: "Description", value: tailor.description },
    { label: "Spécialités", value: tailor.specialties.join(", ") },
  ];

  return (
    <div className="space-y-6">
      {state.message ? (
        <FormAlert variant={state.ok ? "success" : "error"}>{state.message}</FormAlert>
      ) : null}

      <form action={formAction} className="surface-card space-y-6 p-5">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Photo et bannière</h2>
          <p className="mt-1 text-sm text-muted">
            Ajoutez une photo de profil et une bannière pour un rendu professionnel sur votre
            vitrine.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <label htmlFor="bannerFile" className="text-xs font-semibold uppercase tracking-wide text-muted">
              Bannière
            </label>
            <div
              className={cn(
                "relative mt-2 h-36 overflow-hidden rounded-md border border-border bg-surface",
                !bannerDisplay && "flex items-center justify-center",
              )}
            >
              {bannerDisplay ? (
                <OptimizedImage
                  src={bannerDisplay}
                  alt={`Bannière ${tailor.atelierName}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <span className="text-xs text-muted">Aucune bannière</span>
              )}
            </div>
            <input
              id="bannerFile"
              name="bannerFile"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => handleFileChange(event, "banner")}
              className={inputClassName}
            />
            {fieldError(state.fieldErrors, "bannerFile") ? (
              <p className="mt-2 text-xs text-danger">
                {fieldError(state.fieldErrors, "bannerFile")}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="avatarFile" className="text-xs font-semibold uppercase tracking-wide text-muted">
              Photo de profil
            </label>
            <div className="mt-2 flex items-center gap-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-full border border-border bg-surface">
                {avatarDisplay ? (
                  <OptimizedImage
                    src={avatarDisplay}
                    alt={tailor.atelierName}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-muted">
                    Photo
                  </div>
                )}
              </div>
              <input
                id="avatarFile"
                name="avatarFile"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => handleFileChange(event, "avatar")}
                className={cn(inputClassName, "flex-1")}
              />
            </div>
            {fieldError(state.fieldErrors, "avatarFile") ? (
              <p className="mt-2 text-xs text-danger">
                {fieldError(state.fieldErrors, "avatarFile")}
              </p>
            ) : null}
          </div>
        </div>

        {fileError ? <p className="text-xs text-danger">{fileError}</p> : null}

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary-strong disabled:opacity-60"
        >
          {isPending ? "Enregistrement…" : "Enregistrer les images"}
        </button>
      </form>

      <div className="surface-card p-5">
        <p className="mb-4 text-sm text-muted">
          Informations de votre vitrine (texte modifiable prochainement).
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.label} className="rounded-md border border-border bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                {field.label}
              </p>
              <p className="mt-2 text-sm leading-6 text-foreground">{field.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
