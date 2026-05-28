# Analyse du projet Tella (fond en comble)

> Date : 2026-05-28  
> Portée : lecture seule du repo, analyse architecture + data + sécurité/prod + qualité/DX.  
> Contexte produit : marketplace de mise en relation **couturières ↔ clientes** au Togo, contact via **WhatsApp** ; espace **atelier** (`/dashboard/*`) et espace **admin** (validation des inscriptions).

## Stack & architecture

- **Framework** : Next.js **16.2.6** (App Router) + React **19.2.4**  
  - Voir `package.json`, pages dans `src/app/**/page.tsx`.
- **Auth** : NextAuth v5 (Auth.js) **Credentials** + **JWT**  
  - `src/auth.ts`, `src/auth.config.ts`, route `src/app/api/auth/[...nextauth]/route.ts`.
- **Data** : Prisma **6.8.2** + PostgreSQL (optionnel via env)  
  - Schéma `prisma/schema.prisma`, client `src/lib/prisma.ts`, migrations dans `prisma/migrations/*`.
- **Validation** : Zod (`src/lib/validations/*`)
- **UI** : Tailwind CSS v4 (design system maison), pas de shadcn/daisyUI détecté.
- **State** : Zustand présent (usage limité), `src/store/use-discovery-store.ts`.

### Pattern “feature/data flow”

Chaîne principale (documentée et observable dans le code) :

```text
Pages (RSC) → services/ → repositories/ → mock-data OU Prisma
```

- **Services** : `src/services/*` (orchestration métier)
- **Repositories** : `src/repositories/*` avec impl `mock/` et `prisma/` (switch via `USE_PRISMA=true`)
- **Utils / infra** : `src/lib/*`

## Cartographie des fonctionnalités

### Parcours publics

- **Landing** : `src/app/page.tsx` + composants `src/components/landing/*`
- **Explore** : `src/app/explore/page.tsx` (découverte ateliers / contenus)
- **Search** : `src/app/search/page.tsx`
- **Pricing** : `src/app/pricing/page.tsx`
- **Profil public atelier** : `src/app/[handle]/page.tsx` (ex: `/@atelier-ama`)
- **Boutique / détail** : `src/app/boutique/[productSlug]/page.tsx`

### Auth

- **Inscription** : `src/app/register/page.tsx` + UI `src/components/auth/register-form.tsx` (wizard)
- **Connexion** : `src/app/login/page.tsx` + UI `src/components/auth/login-form.tsx`
- **Actions serveur** : `src/actions/auth-actions.ts`
- **Métier auth** : `src/services/auth-service.ts`
- **Typing session/JWT** : `src/types/next-auth.d.ts`

### Dashboard (atelier / admin)

- **Layout dashboard** : `src/app/dashboard/layout.tsx`
- **Guards côté serveur** : `src/lib/session.ts` (`requireSession`, `requireTailorSession`)
- **Admin – demandes d’inscription** : `src/app/dashboard/demandes/page.tsx`  
  - Mutations : `src/actions/admin-actions.ts`  
  - Queries/métier : `src/services/admin-service.ts`
- Autres pages (souvent placeholder):  
  - `src/app/dashboard/statistiques/page.tsx`  
  - `src/app/dashboard/commandes/page.tsx`  
  - `src/app/dashboard/parametres/page.tsx`  
  - `src/app/dashboard/creations/page.tsx`

## Données (Prisma) — modèle & relations

Fichier source : `prisma/schema.prisma`.

### Entités principales

- **User**
  - Champs : `email` (unique, nullable), `phone` (unique, nullable), `passwordHash` (nullable), `role` (enum).
  - Relations : `tailorProfile` (optionnelle), `reviews` (auteur), `orders` (client), `favorites`, `messages`.
- **TailorProfile**
  - 1–1 avec `User` via `userId @unique`.
  - Identité publique : `handle @unique`.
  - Gouvernance : `isApproved`, `isPublished`.
  - Statistiques : `viewsCount`, `whatsappClicks`, etc.
- **Post** : création/produit (slug unique), lien `TailorProfile`, catégorie optionnelle.
- **Review** : note/commentaire, lien `TailorProfile` + `User` auteur.
- **Order** : relation client ↔ atelier (statut string pour l’instant).
- **Favorite** : unique composite `@@unique([userId, tailorProfileId])`.
- **Subscription** : abonnement côté atelier (unique `tailorProfileId`), statut enum `SubscriptionStatus`.

### RBAC / rôle utilisateur

- Enum `UserRole`: `CLIENT | TAILOR | ADMIN`.
- `User.role` est présent dans le schéma Prisma et propagé dans session/JWT :
  - `src/auth.config.ts` (callbacks `jwt` & `session`)
  - `src/types/next-auth.d.ts`
- Migration de rattrapage : `prisma/migrations/20260526150000_add_user_role_column/migration.sql` (ajout de `role` si manquant, défaut `TAILOR`).

## Auth & sécurité — état actuel

### AuthN (connexion)

- Provider Credentials dans `src/auth.ts` :
  - `authorize()` appelle `authenticateUser()` (`src/services/auth-service.ts`)
  - Retourne un objet user enrichi : `id`, `email`, `name`, `role`, `tailorProfileId`, `handle`.
- `src/services/auth-service.ts` :
  - Validation Zod
  - Vérification bcrypt
  - Blocage d’une couturière non approuvée (`ACCOUNT_PENDING`).

### AuthZ (autorisation)

- Guard “session requise dashboard” : logique de proxy `src/proxy.ts` (redirige vers `/login` si pas connecté).
- Admin-only :
  - Page : `src/app/dashboard/demandes/page.tsx` (redirect si pas `ADMIN`)
  - Server actions : `src/actions/admin-actions.ts` (check role, sinon `throw new Error(...)`).
- Tailor-only + profil lié : `requireTailorSession()` dans `src/lib/session.ts`.

### P0 / P1 / P2 — sécurité & prod (priorisé)

#### P0 — Open redirect (phishing) via `callbackUrl`

- **Où**
  - `src/app/login/page.tsx` : `redirect(callbackUrl)` si session déjà présente.
  - `src/actions/auth-actions.ts` : `redirect(callbackUrl)` issu d’un champ POST (forgeable).
- **Risque** : redirection vers un domaine externe contrôlé (phishing/exfiltration).
- **Fix attendu** : n’accepter que des chemins internes (relatifs) et refuser `http(s)://`, `//`, etc. Appliquer au niveau page **et** action serveur.

#### P1 — Hardening prod manquant

- **Security headers absents** (CSP/HSTS/Referrer-Policy/Permissions-Policy/nosniff)  
  - `next.config.ts` ne définit pas `headers()`.
- **Pas de rate limiting / anti-abuse** sur login et actions admin  
  - `src/actions/auth-actions.ts`, `src/actions/admin-actions.ts`.
- **`trustHost: true` (Auth.js)** à valider en prod  
  - `src/auth.config.ts` ; dépend de la config proxy/host. À verrouiller via variables et config explicite si possible.
- **RBAC dispersé** : checks par page + par action, mais pas de centralisation complète (risque d’oublis sur futures routes).

#### P2 — Hygiène / signaux faibles

- **Identifiants démo hardcodés côté UI** (si présents en prod, risque)  
  - Exemple : `src/components/auth/login-form.tsx` (const email/mdp démo).
- **Cookies options non explicites** : stratégie JWT ok, mais options cookies pas explicitement durcies (à cadrer selon prod HTTPS).

## Qualité / DX / maintenabilité

### Scripts & tooling

- Scripts actuels (npm) : `dev`, `build`, `start`, `lint`, `prisma:*` (`package.json`).
- Pas de `pnpm-lock.yaml` ; repo plutôt “npm” (README mentionne npm, `package-lock.json` probable).
- ESLint v9 + `eslint-config-next/core-web-vitals` (`eslint.config.mjs`).
- Prettier non détecté (pas de config).
- Tests/CI non détectés (`.github/workflows/*` absent, pas de Playwright/Jest/Vitest configuré).

### RSC vs client

- Pages majoritairement RSC (bon pour perf).
- Quelques composants `"use client"` (forms, nav). À garder “leaf components”.

### Point critique “middleware / guard global”

- Le code de guard global est dans `src/proxy.ts`.  
  - À confirmer en exécution : Next.js ne reconnaît un middleware que via un fichier nommé `middleware.ts` (root ou `src/`).  
  - Si aucun `middleware.ts` n’existe, le guard risque de **ne jamais s’exécuter** en prod/dev (à valider par test manuel `/dashboard` non connecté).

## Dette technique & quick wins (actionnables)

### Quick wins (faible effort / fort impact)

- **Sécuriser `callbackUrl`** (P0) dans `src/app/login/page.tsx` et `src/actions/auth-actions.ts`.
- **Valider le middleware** : s’assurer que la protection `/dashboard/*` s’exécute réellement (naming/placement).
- **Ajouter sécurité prod de base** : headers, rate limit, et stratégie de logging/observabilité.
- **Centraliser les guards** :
  - ex. `requireAdminSession()` dans `src/lib/session.ts` et l’utiliser partout (pages + actions).
- **Standardiser le package manager** (npm vs pnpm) et documenter une seule voie.

### Dette à surveiller

- **Parité mock/prisma** : utile mais exige discipline (éviter divergences fonctionnelles).
- **`src/store/use-discovery-store.ts`** : vérifier que l’impl est idiomatique Zustand et non un objet global mutable.
- **Pages dashboard placeholders** : clarifier ce qui est “ready” vs “à venir” pour éviter confusion produit.

## Fichiers “cœur” à connaître

1. `prisma/schema.prisma`
2. `src/auth.ts`
3. `src/auth.config.ts`
4. `src/proxy.ts`
5. `src/lib/session.ts`
6. `src/actions/auth-actions.ts`
7. `src/services/auth-service.ts`
8. `src/actions/admin-actions.ts`
9. `src/services/admin-service.ts`
10. `src/repositories/index.ts` + `src/lib/data-source.ts`

