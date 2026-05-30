import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";

import { CREATION_IMAGE_MAX_BYTES } from "@/lib/creation-image-limits";

const MAX_BYTES = CREATION_IMAGE_MAX_BYTES;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function saveProfileImageFile(
  file: File,
  kind: "avatar" | "banner",
): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Format accepté : JPG, PNG ou WebP.");
  }

  if (file.size > MAX_BYTES) {
    throw new Error("Image trop lourde (max 5 Mo).");
  }

  const ext =
    file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const filename = `${kind}-${Date.now()}-${randomBytes(6).toString("hex")}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "profiles");

  await mkdir(uploadDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), buffer);

  return `/uploads/profiles/${filename}`;
}
