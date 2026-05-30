/**
 * Vide toutes les données applicatives sans toucher au schéma Prisma.
 * Réinsère uniquement les catégories (données de référence).
 *
 * Usage :
 *   pnpm db:clear
 */
import "dotenv/config";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  { name: "Robes", slug: "robes" },
  { name: "Homme", slug: "homme" },
  { name: "Mariage", slug: "mariage" },
  { name: "Enfant", slug: "enfant" },
  { name: "Uniformes", slug: "uniformes" },
  { name: "Traditionnel", slug: "traditionnel" },
] as const;

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("Erreur : DATABASE_URL manquant dans .env");
    process.exit(1);
  }

  console.log("Suppression de toutes les données…");

  await prisma.message.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.post.deleteMany();
  await prisma.portfolio.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.tailorProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();

  for (const category of categories) {
    await prisma.category.create({ data: category });
  }

  const counts = {
    users: await prisma.user.count(),
    tailors: await prisma.tailorProfile.count(),
    posts: await prisma.post.count(),
    categories: await prisma.category.count(),
  };

  console.log("Base vidée avec succès.");
  console.log(counts);
  console.log("");
  console.log("Prochaines étapes :");
  console.log('  1. Créer un admin : ADMIN_EMAIL="..." ADMIN_PASSWORD="..." pnpm admin:create');
  console.log("  2. Inscrire les ateliers via /register");
}

main()
  .catch((error) => {
    console.error("Échec du vidage :", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
