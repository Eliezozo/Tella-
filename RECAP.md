# Tella — Récapitulatif du développement

> Dernière mise à jour : mai 2026  
> Branche : `master`

## Vision produit

Marketplace Next.js pour couturières et clientes au **Togo**. Contact via **WhatsApp**, abonnements gérés hors plateforme. Pas de paiement client intégré.

---

## Stack technique

| Couche | Choix |
|--------|--------|
| Framework | Next.js 16 (App Router), React 19 |
| Style | Tailwind CSS 4, design tokens (primary `#C4522A`, etc.) |
| Données | Mock par défaut (`USE_PRISMA=false`) ou Prisma + PostgreSQL |
| Auth | NextAuth v5 (Auth.js), Credentials, JWT |
| Validation | Zod |
| Mots de passe | bcryptjs |

---

## Architecture données

```text
Pages (RSC) → services/ → repositories/ → mock-data OU Prisma
```

- **Services** : `discovery-service`, `tailor-service`, `creation-service`, `auth-service`, etc.
- **Repositories** : paires `mock/` et `prisma/` sélectionnées via `getDataSourceMode()`
- **Activation** : `USE_PRISMA=true` + `DATABASE_URL` dans `.env`

---

## Authentification & comptes atelier

### Routes

| Route | Description |
|-------|-------------|
| `/register` | Inscription atelier en **3 étapes** (atelier → contact → vitrine) |
| `/login` | Connexion email ou téléphone + mot de passe |
| `/dashboard/*` | Espace pro protégé (middleware) |

### Règles métier (validées)

1. **Activation** : validation **manuelle par un admin** (`isApproved` sur `TailorProfile`).
2. **Compte non activé (option B)** : **pas de connexion** ; message sur `/login`.
3. **Visibilité publique** : profil visible seulement si `isApproved` **et** `isPublished` (toggle admin).
4. **Inscription** : pas de connexion automatique après register ; écran de confirmation avec handle réservé.

### Compte démo (mode mock)

- Email : `ama@tella.tg`
- Mot de passe : `TellaDemo2026`
- Profil : `@atelier-ama` (approuvé et publié)

### Fichiers clés auth

- `src/auth.ts` — NextAuth + provider Credentials
- `src/middleware.ts` — protection `/dashboard`, redirection si déjà connecté
- `src/services/auth-service.ts` — register, login, `ACCOUNT_PENDING`
- `src/actions/auth-actions.ts` — server actions formulaires
- `src/lib/auth-form-state.ts` — état formulaires (hors `"use server"`)
- `src/lib/parse-register-form.ts` — parsing `FormData` inscription
- `src/components/auth/register-form.tsx` — wizard 3 étapes
- `src/components/auth/register-success.tsx` — confirmation post-inscription
- `src/components/auth/login-form.tsx` — connexion + bouton démo

### Prisma

- `User.passwordHash`
- `TailorProfile.isApproved` (défaut `false`)
- `TailorProfile.isPublished` (défaut `false`)
- Seed : ateliers mock approuvés + publiés, mot de passe démo sur le premier

### Configuration `.env`

```bash
AUTH_SECRET=...      # openssl rand -base64 32
AUTH_URL=http://localhost:3000
USE_PRISMA=false
```

---

## Pages & parcours publics

- **Landing** : sections modulaires `src/components/landing/`
- **Explore / Search** : découverte ateliers et créations (mock ou Prisma)
- **Profil** : `/[handle]` — fiche atelier publique
- **Boutique** : `/boutique/[productSlug]`
- **Pricing** : tarifs abonnement couturières

---

## Dashboard

- **Couturière connectée** : vue d’ensemble atelier (stats du profil mock/DB)
- **Admin** (autres rôles / fallback) : vue plateforme démo
- Sous-pages : créations, statistiques, paramètres, abonnements (partiellement mock)
- **À faire** : édition profil réelle, upload créations, stats réelles

---

## Corrections techniques récentes

| Problème | Solution |
|----------|----------|
| `MissingSecret` | Fichier `.env` + `AUTH_SECRET` |
| Export objet dans `"use server"` | `authFormInitialState` déplacé vers `auth-form-state.ts` |
| Connexion démo échoue mais session créée | `signIn({ redirect: false })` + `redirect()` ; rethrow navigation errors |
| Clic « Créer mon atelier » → dashboard | Session résiduelle + middleware ; redirection si déjà connecté sur `/login` |

---

## Prochaines étapes suggérées

1. **Admin** : liste ateliers en attente, boutons Approuver / Publier (`isApproved`, `isPublished`).
2. **Dashboard couturière** : édition profil (`/dashboard/parametres`).
3. **CRUD créations** : upload médias, liste filtrée par atelier connecté.
4. **Statistiques** : vues profil, clics WhatsApp (tracking).
5. **Prisma en prod** : migration `isApproved`, seed, `USE_PRISMA=true`.

---

## Commandes utiles

```bash
npm install
npm run dev

# Prisma (optionnel)
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

---

## Structure projet (extrait)

```text
src/
├── app/              # pages App Router
├── actions/          # server actions auth
├── auth.ts           # NextAuth config
├── middleware.ts
├── components/
│   ├── auth/
│   ├── landing/
│   └── layout/
├── lib/
│   ├── validations/
│   └── constants/
├── repositories/
├── services/
└── types/
prisma/
└── schema.prisma
```
