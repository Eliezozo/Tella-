-- Align User table with schema: role column was missing despite migration history.
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "role" "UserRole" NOT NULL DEFAULT 'TAILOR';
