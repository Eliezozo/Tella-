import { hashSync } from "bcryptjs";

import {
  buildCreationMetadata,
} from "../src/lib/mappers/discovery-mappers";
import {
  creations,
  pricingPlans,
  reviews,
  tailorProfiles,
} from "../src/lib/mock-data";
import { showcaseImageSrc } from "../src/lib/showcase-images";
import { PrismaClient, SubscriptionStatus, UserRole } from "@prisma/client";

const DEMO_PASSWORD_HASH = hashSync("TellaDemo2026", 12);

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

  const categoryMap = new Map<string, string>();
  for (const category of categories) {
    const row = await prisma.category.create({ data: category });
    categoryMap.set(category.slug, row.id);
  }

  const tailorIdMap = new Map<string, string>();

  for (const [index, tailor] of tailorProfiles.entries()) {
    const user = await prisma.user.create({
      data: {
        name: tailor.atelierName,
        email:
          index === 0
            ? "ama@tella.tg"
            : `${tailor.handle.replace("@", "")}@tella.tg`,
        phone: tailor.whatsapp,
        passwordHash: index === 0 ? DEMO_PASSWORD_HASH : undefined,
        role: UserRole.TAILOR,
      },
    });

    const profile = await prisma.tailorProfile.create({
      data: {
        userId: user.id,
        handle: tailor.handle,
        atelierName: tailor.atelierName,
        city: tailor.city,
        bio: tailor.description,
        heroLabel: tailor.heroLabel,
        whatsapp: tailor.whatsapp,
        avatarUrl: tailor.avatarUrl,
        bannerUrl: tailor.coverUrl,
        specialties: tailor.specialties,
        responseRate: tailor.responseRate,
        averageRating: tailor.rating,
        reviewsCount: tailor.reviewsCount,
        completedOrders: tailor.completedOrders,
        isApproved: true,
        isPublished: true,
      },
    });

    tailorIdMap.set(tailor.id, profile.id);

    const plan = pricingPlans[1];
    await prisma.subscription.create({
      data: {
        tailorProfileId: profile.id,
        planKey: plan.id,
        status: SubscriptionStatus.ACTIVE,
        amount: plan.amount,
        renewsAt: new Date("2026-06-30"),
      },
    });
  }

  for (const creation of creations) {
    const tailorProfileId = tailorIdMap.get(creation.tailorId);
    if (!tailorProfileId) continue;

    await prisma.post.create({
      data: {
        slug: creation.slug,
        tailorProfileId,
        categoryId: categoryMap.get(creation.category),
        title: creation.title,
        description: creation.title,
        mediaUrl: creation.imageUrl ?? showcaseImageSrc(0),
        priceFrom: creation.priceFrom,
        turnaroundLabel: creation.turnaround,
        likesCount: creation.likes,
        metadata: buildCreationMetadata(creation),
      },
    });
  }

  await prisma.user.create({
    data: {
      name: "Admin Tella",
      email: "admin@tella.tg",
      passwordHash: DEMO_PASSWORD_HASH,
      role: UserRole.ADMIN,
    },
  });

  const client = await prisma.user.create({
    data: { name: "Cliente Tella", role: UserRole.CLIENT },
  });

  for (const review of reviews) {
    const tailorProfileId = tailorIdMap.get(review.tailorId);
    if (!tailorProfileId) continue;

    await prisma.review.create({
      data: {
        tailorProfileId,
        authorId: client.id,
        rating: review.rating,
        comment: review.comment,
      },
    });
  }

  console.log("Seed terminé.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
