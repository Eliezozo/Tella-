# Tella

Tella est une plateforme web de mise en relation entre couturières et clientes au Togo.

Objectifs du socle actuel :

- landing premium mobile-first
- pages publiques `Home`, `Explore`, `Search`, `Pricing`
- profil public de couturière via une URL du type `/${"@atelier"}`
- auth couturière (inscription, connexion, session JWT)
- dashboard atelier / admin selon le rôle connecté
- design system cohérent avec l’identité Tella
- schéma Prisma prêt pour la gestion des ateliers, abonnements et demandes

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS 4
- Prisma + PostgreSQL
- Zustand
- NextAuth v5 (Auth.js) + bcryptjs + Zod

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

## Auth (couturière)

```bash
cp .env.example .env
# Définir AUTH_SECRET (openssl rand -base64 32) et AUTH_URL
```

| Route | Rôle |
|-------|------|
| `/register` | Inscription atelier en 3 étapes (atelier → contact → vitrine) |
| `/login` | Connexion email ou téléphone + mot de passe |
| `/dashboard/*` | Protégé par middleware (session requise) |

**Mode mock** (défaut, sans base) : compte démo **activé** `ama@tella.tg` / `TellaDemo2026` → profil `@atelier-ama`.

**Validation admin (option B)** : les nouvelles inscriptions ne peuvent pas se connecter tant que `isApproved` est faux ; message affiché sur `/login`. Le profil public nécessite `isApproved` + `isPublished` (activés par l’admin).

**Mode Prisma** : mêmes identifiants après `npm run prisma:seed` sur le premier atelier seedé.

Couche : `auth-service` → `auth-repository` (mock ou prisma) → NextAuth Credentials.

## Prochaines phases métier

1. Admin : abonnements et statistiques depuis Prisma.
3. Favoris, suivi clics WhatsApp, upload médias.
4. Formulaires React Hook Form + Zod.
