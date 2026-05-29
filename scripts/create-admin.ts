/**
 * Crée ou met à jour un compte ADMIN sans effacer la base.
 *
 * Usage :
 *   ADMIN_EMAIL="vous@email.com" ADMIN_PASSWORD="MotDePasseFort123" npm run admin:create
 *
 * Variables lues depuis .env si présentes : ADMIN_EMAIL, ADMIN_PASSWORD
 */
import "dotenv/config";

import { hashSync } from "bcryptjs";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error(
      "Erreur : définissez ADMIN_EMAIL et ADMIN_PASSWORD.\n" +
        'Exemple : ADMIN_EMAIL="admin@tella.tg" ADMIN_PASSWORD="MonMotDePasse123" npm run admin:create',
    );
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("Erreur : ADMIN_PASSWORD doit contenir au moins 8 caractères.");
    process.exit(1);
  }

  if (!process.env.DATABASE_URL) {
    console.error("Erreur : DATABASE_URL manquant dans .env");
    process.exit(1);
  }

  const passwordHash = hashSync(password, 12);

  const existing = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
  });

  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: {
        name: existing.name ?? "Admin Tella",
        role: UserRole.ADMIN,
        passwordHash,
      },
    });
    console.log(`Compte admin mis à jour : ${email}`);
    console.log("Connectez-vous sur /login puis ouvrez /dashboard/demandes");
    return;
  }

  await prisma.user.create({
    data: {
      name: "Admin Tella",
      email,
      passwordHash,
      role: UserRole.ADMIN,
    },
  });

  console.log(`Compte admin créé : ${email}`);
  console.log("Connectez-vous sur /login puis ouvrez /dashboard/demandes");
}

main()
  .catch((error) => {
    console.error("Échec création admin :", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
