# Tella

Tella est une plateforme web de mise en relation entre couturières et clientes au Togo.

Objectifs du socle actuel :

- landing premium mobile-first
- pages publiques `Home`, `Explore`, `Search`, `Pricing`
- profil public de couturière via une URL du type `/${"@atelier"}`
- dashboard administrateur pour piloter couturières et abonnements
- design system cohérent avec l’identité Tella
- schéma Prisma prêt pour la gestion des ateliers, abonnements et demandes

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

## Logique métier (découverte)

Architecture en couches :

```text
Pages (RSC) → services/ → repositories/ → mock-data ou Prisma
```

- **Services** : `discovery-service`, `tailor-service`, `creation-service`, `pricing-service`, `testimonial-service`
- **Repositories** : implémentations `mock/` (par défaut) et `prisma/` (si `USE_PRISMA=true`)
- **Schéma** : `prisma/schema.prisma` (ateliers, posts, avis, abonnements, commandes)

### Activer PostgreSQL plus tard

```bash
cp .env.example .env
# Renseigner DATABASE_URL, puis USE_PRISMA=true
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

## Prochaines phases métier

1. Auth + inscription couturière (création profil réel).
2. Admin : abonnements et statistiques depuis Prisma.
3. Favoris, suivi clics WhatsApp, upload médias.
4. Formulaires React Hook Form + Zod.
