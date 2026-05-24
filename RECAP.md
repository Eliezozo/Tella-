# Tella — Récapitulatif du développement

> Dernière mise à jour : **24 mai 2026**  
> Branche : `master` — dépôt : `github.com/Eliezozo/Tella-`

## Vision produit

Marketplace Next.js pour couturières et clientes au **Togo**. Contact via **WhatsApp**, abonnements gérés hors plateforme. Pas de paiement client intégré.

**Deux espaces distincts :**

| Public | Rôle |
|--------|------|
| Visiteuses | Landing, Explore, Search, profils `/@handle`, boutique |
| Couturière connectée | `/dashboard/*` — gestion atelier, collections, paramètres |
| Admin Tella | `/dashboard/demandes` — validation des nouvelles inscriptions |

---

## Stack technique

| Couche | Choix |
|--------|--------|
| Framework | Next.js 16 (App Router), React 19 |
| Style | Tailwind CSS 4, design tokens (primary `#C4522A`, etc.) |
| Données | Mock (`USE_PRISMA=false`) ou **Prisma + PostgreSQL** (Neon en prod) |
| Auth | NextAuth v5 (Auth.js), Credentials, JWT |
| Validation | Zod |
| Mots de passe | bcryptjs |
| Hébergement | Vercel |

---

## Architecture données

```text
Pages (RSC) → services/ → repositories/ → mock-data OU Prisma
```

- **Services** : `discovery-service`, `tailor-service`, `creation-service`, `auth-service`, `admin-service`, etc.
- **Repositories** : paires `mock/` et `prisma/` via `getDataSourceMode()`
- **Activation Prisma** : `USE_PRISMA=true` + `DATABASE_URL` dans `.env`

### Base de données (Prisma)

Migration initiale : `prisma/migrations/20260524013658_init/`

Tables : `User`, `TailorProfile`, `Category`, `Post`, `Portfolio`, `Review`, `Order`, `Message`, `Favorite`, `Subscription`.

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npx prisma studio   # inspection visuelle
```

---

## Authentification & comptes atelier

### Routes

| Route | Description |
|-------|-------------|
| `/register` | Inscription atelier en **3 étapes** (atelier → contact → vitrine) |
| `/login` | Connexion email ou téléphone + mot de passe |
| `/dashboard/*` | Espace pro protégé (**proxy**) |
| `/dashboard/demandes` | **Admin** — file d’attente inscriptions |

### Règles métier

1. **Activation** : validation manuelle admin (`isApproved` sur `TailorProfile`).
2. **Compte non activé** : pas de connexion ; message sur `/login`.
3. **Visibilité publique** : `isApproved` **et** `isPublished`.
4. **Inscription** : pas de session auto ; écran de confirmation + handle réservé.

### Comptes démo (après seed Prisma ou mock)

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Couturière | `ama@tella.tg` | `TellaDemo2026` |
| Admin | `admin@tella.tg` | `TellaDemo2026` |

Profil public couturière : `/@atelier-ama`

### Fichiers clés auth

- `src/auth.config.ts` — config JWT/pages/callbacks **sans** Prisma (proxy / edge léger)
- `src/auth.ts` — NextAuth + Credentials + `authenticateUser`
- `src/proxy.ts` — protection routes, redirections (remplace `middleware.ts`, Next.js 16)
- `src/services/auth-service.ts` — register, login, `ACCOUNT_PENDING`
- `src/actions/auth-actions.ts` — server actions formulaires
- `src/actions/admin-actions.ts` — approuver / publier un atelier
- `src/services/admin-service.ts` — liste demandes en attente
- `src/components/auth/register-form.tsx` — wizard 3 étapes + validation par étape
- `src/lib/handle.ts` — `toTailorProfilePath()`, `normalizeHandle()`

### Configuration `.env`

```bash
DATABASE_URL=postgresql://...   # Neon ou local
USE_PRISMA=true
AUTH_SECRET=...                 # openssl rand -base64 32
AUTH_URL=http://localhost:3000  # ou URL Vercel en prod
```

---

## Pages & parcours publics

- **Landing** : `src/components/landing/`
- **Explore / Search** : découverte ateliers et créations
- **Profil** : `/[handle]` avec `@` (ex. `/@atelier-ama`) — bandeau « Gérer mon atelier » si propriétaire connectée
- **Boutique** : `/boutique/[productSlug]`
- **Pricing** : tarifs abonnement
- **Navigation** : bouton **← Retour** (page précédente) sur toutes les pages sauf l’accueil

---

## Dashboard

### Couturière (`role === TAILOR`)

- Header dédié **« Espace atelier »** (`TailorDashboardHeader`) — plus le header marketplace
- Logo → `/dashboard` ; accueil `/` redirige vers le dashboard si connectée
- **Vue d’ensemble** : stats, actions rapides, aperçu créations
- **Mes créations** : catalogue filtré par atelier + carte « Ajouter » (mock, pas encore persisté)
- **Paramètres** : champs atelier en lecture seule (édition à brancher)
- **Statistiques** : libellés adaptés couturière
- Lien **Vitrine publique** → profil `/@handle`

### Admin (`role === ADMIN`)

- **Demandes ateliers** (`/dashboard/demandes`) : liste `isApproved: false`
  - **Approuver le compte** → connexion possible
  - **Approuver + publier** → connexion + visible sur Explore
- Redirection `/` → `/dashboard/demandes`

---

## Session du 24 mai 2026

### UX & navigation

- Bouton **Retour** (`BackButton` / `PageBackNav`) au lieu de renvoi systématique à l’accueil
- Séparation claire **marketplace** vs **espace atelier** pour la couturière connectée
- Correction liens profil : `toTailorProfilePath()` avec `@` (ex. `/@atelier-ama`)

### Inscription & admin

- **Fix** bouton « Créer mon atelier » : `noValidate` + validation Zod par étape (champs `required` cachés bloquaient le submit HTML5)
- Page **`/dashboard/demandes`** pour recevoir et traiter les inscriptions
- Compte **admin@tella.tg** ajouté au seed
- Fix date affichée admin : `user.createdAt` (pas `TailorProfile.createdAt`)

### Base de données

- Connexion **Neon** PostgreSQL activée (`USE_PRISMA=true`)
- Migration `init` + seed (ateliers mock, posts, admin, compte démo)

### Déploiement Vercel

- Renommage **`middleware.ts` → `proxy.ts`** (convention Next.js 16)
- Split **`auth.config.ts`** / **`auth.ts`** pour réduire le bundle Edge (< 1 Mo — sans Prisma/bcrypt dans le proxy)
- Script **`npm run dev:clean`** : `rm -rf .next && next dev` (cache Turbopack pointait encore vers l’ancien `middleware.ts`)

### Git

- Convention : **commit + push** sur `master` en fin de tâche
- Derniers commits notables : `4e045d7` (auth/admin/proxy), `5d7dfc7` (dev:clean)

---

## Corrections techniques (historique)

| Problème | Solution |
|----------|----------|
| `MissingSecret` | `.env` + `AUTH_SECRET` |
| Export objet dans `"use server"` | `auth-form-state.ts` séparé |
| Connexion démo / redirect | `signIn({ redirect: false })` + `redirect()` |
| Profil 404 (`/atelier-ama` sans `@`) | `normalizeHandle` + `toTailorProfilePath` |
| Edge Function > 1 Mo Vercel | `auth.config.ts` sans providers ; proxy importe uniquement ça |
| `middleware.ts` not found (dev) | Supprimer `.next` ou `npm run dev:clean` |

---

## Prochaines étapes (demain et après)

1. **CRUD créations** : formulaire réel + persistance Prisma (`Post`), upload images.
2. **Édition profil** : `/dashboard/parametres` enregistrable (atelier, WhatsApp, bio).
3. **Notifications admin** : email ou WhatsApp quand nouvelle inscription (Resend / webhook).
4. **Statistiques réelles** : incrémenter `viewsCount`, `whatsappClicks` sur profil/boutique.
5. **Tests E2E** : parcours register → approbation admin → login couturière.
6. **Variables Vercel** : vérifier `AUTH_URL` production, `USE_PRISMA`, `DATABASE_URL`.

---

## Commandes utiles

```bash
npm install
npm run dev
npm run dev:clean    # si erreur cache middleware / proxy

npm run build
npm run lint

# Prisma
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

---

## Structure projet (extrait)

```text
src/
├── app/
│   ├── dashboard/
│   │   ├── demandes/     # admin — inscriptions en attente
│   │   ├── creations/
│   │   └── parametres/
│   ├── [handle]/         # vitrine publique
│   └── register/
├── actions/
│   ├── auth-actions.ts
│   └── admin-actions.ts
├── auth.config.ts        # edge-safe (proxy)
├── auth.ts               # providers + DB
├── proxy.ts              # ex-middleware
├── components/
│   ├── auth/
│   ├── dashboard/
│   ├── landing/
│   └── layout/
├── lib/
│   ├── handle.ts
│   └── validations/
├── repositories/
├── services/
│   ├── admin-service.ts
│   └── auth-service.ts
└── types/
prisma/
├── schema.prisma
└── migrations/
```
