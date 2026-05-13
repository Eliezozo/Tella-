# Tella

Tella est une plateforme web pour couturières, ateliers et stylistes au Togo.

Objectifs du socle actuel :

- landing premium mobile-first
- pages publiques `Home`, `Explore`, `Search`, `Pricing`
- profil public de couturière via une URL du type `/${"@atelier"}`
- dashboard couturière initial
- design system cohérent avec l’identité Tella
- schéma Prisma prêt pour l’évolution marketplace

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS 4
- Prisma + PostgreSQL
- Zustand

## Lancer le projet

```bash
npm install
npm run dev
```

## Structure

```text
src/
├── app/
├── components/
├── hooks/
├── lib/
├── services/
├── store/
└── types/
prisma/
└── schema.prisma
```

## Prochaines intégrations backend

1. Auth.js / NextAuth pour l’authentification.
2. Prisma Client + migrations PostgreSQL.
3. UploadThing ou Cloudinary pour photos et vidéos.
4. Formulaires React Hook Form + Zod.
5. Paiement Mobile Money et gestion d’abonnements.
