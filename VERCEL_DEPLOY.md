# Déploiement Vercel — Checklist Tella

Document de référence pour diagnostiquer/corriger les problèmes de **connexion** et de **création d'atelier** en production, et activer les **notifications admin**.

## 1. Variables d'environnement Vercel (obligatoires)

Aller dans **Project Settings → Environment Variables → Production** (et **Preview** si tu testes les PR), puis créer :

| Variable | Valeur (prod) | Pourquoi |
|----------|---------------|----------|
| `DATABASE_URL` | URL Neon (pooler) | Connexion Postgres |
| `USE_PRISMA` | `true` | **Sans ça, les inscriptions vont dans le mock et disparaissent à chaque invocation serverless** |
| `AUTH_SECRET` | `openssl rand -base64 32` | Signature JWT |
| `AUTH_URL` | `https://<ton-projet>.vercel.app` | **Ne PAS laisser `http://localhost:3000`** |
| `RESEND_API_KEY` | clé Resend | Email admin |
| `RESEND_FROM_EMAIL` | `Tella <onboarding@resend.dev>` (au début) | Expéditeur |
| `ADMIN_EMAIL` | `sossoumawupenukukpoe@gmail.com` | Destinataire email |
| `CALLMEBOT_API_KEY` | clé CallMeBot | WhatsApp admin |
| `ADMIN_WHATSAPP_PHONE` | `+22892878037` | Destinataire WhatsApp |

**Astuce** : les variables marquées "Sensitive" ne doivent jamais être affichées dans les logs.

## 2. Causes les plus probables de tes bugs prod

### Bug 1 — Inscription : le compte semble créé mais on ne peut pas se connecter ensuite

- **Cause probable** : `USE_PRISMA` absent ou `false` en prod → les comptes vont dans le mock in-memory.
- **Diagnostic** : ouvrir les logs Vercel après une inscription. Si tu ne vois pas une requête Prisma vers Neon, c'est ça.
- **Fix** : ajouter `USE_PRISMA=true` dans les env vars Vercel et redéployer.

### Bug 2 — Connexion : message générique « Email ou mot de passe incorrect »

- **Cause possible** : la migration `add_user_role_column` n'a pas été appliquée → la colonne `role` est absente, Prisma plante, `authorize()` catch et renvoie null.
- **Fix automatique** : le `build` script lance maintenant `prisma migrate deploy` à chaque build Vercel.
- **Vérification** : dans les logs Vercel après le commit, chercher `Applying migration` ou `No pending migrations`.
- **Fix manuel ponctuel** (en local, avec `DATABASE_URL` pointant Neon prod) :
  ```bash
  npx prisma migrate deploy
  ```

### Bug 3 — `MissingSecret` ou redirections cassées

- **Cause** : `AUTH_SECRET` absent ou `AUTH_URL` pointant localhost.
- **Fix** : renseigner les deux dans Vercel.

### Bug 4 — Login boucle ou cookies ignorés

- **Cause** : `AUTH_URL` ne correspond pas exactement à l'URL Vercel (incl. https://).
- **Fix** : copier l'URL Vercel exacte. Si tu utilises un domaine custom (ex: `tella.tg`), c'est cette URL qu'il faut.

## 3. Activer les notifications

### Email — Resend (gratuit 100/jour)

1. Créer un compte sur [resend.com](https://resend.com).
2. Onglet **API Keys → Create API Key** (mode `Full access`).
3. Copier la clé `re_...` dans `RESEND_API_KEY` (Vercel).
4. Pour un domaine custom (`@tella.tg`) :
   - Onglet **Domains → Add Domain**, suivre les DNS (TXT + CNAMEs).
   - Une fois vérifié, changer `RESEND_FROM_EMAIL="Tella <noreply@tella.tg>"`.
5. Sinon laisser l'expéditeur `onboarding@resend.dev` (limité au mode test, mais utile au début).

**Test rapide** : créer une fausse inscription, vérifier l'inbox de `sossoumawupenukukpoe@gmail.com`. Si rien n'arrive, regarder les logs Vercel — il y aura un warning `[notifications/email]` avec la cause.

### WhatsApp — CallMeBot (gratuit)

Setup unique (depuis le téléphone qui doit recevoir les alertes) :

1. Ajouter le contact **+34 644 91 95 11** sur WhatsApp.
2. Envoyer le message exact : `I allow callmebot to send me messages`.
3. Le bot répond avec une **API key** (ex: `1234567`).
4. Copier cette clé dans `CALLMEBOT_API_KEY` (Vercel).
5. Vérifier que `ADMIN_WHATSAPP_PHONE` contient bien `+22892878037`.

**Test rapide** : créer une fausse inscription, le téléphone admin doit recevoir un message dans les ~10s.

**Limitations CallMeBot** :
- Max 1 message toutes les 5 minutes par numéro.
- Service "best effort", pas SLA — bon pour des alertes admin, pas pour du transactionnel client.

Si tu veux passer à du production-grade plus tard : Twilio WhatsApp ou Meta WhatsApp Cloud API (le code dans `src/lib/notifications/whatsapp-client.ts` se remplace en ~30 lignes).

## 4. Comportement fail-safe

- Si `RESEND_API_KEY` ou `CALLMEBOT_API_KEY` est vide, **l'inscription continue de marcher** : la notification est simplement loguée comme "désactivée" dans Vercel.
- Si l'envoi échoue (réseau, quota), l'inscription **ne remonte pas l'erreur** au client — log seulement.

## 5. Diagnostic en 2 minutes

```bash
# Depuis ton terminal local, avec DATABASE_URL pointant prod
npx prisma db pull          # vérifie que la connexion Neon marche
npx prisma migrate status   # vérifie l'état des migrations
```

Sur Vercel, **Deployments → ton déploiement → Logs**, filtrer par `[auth.authorize]`, `[loginAction]`, `[registerTailorAction]`, `[notifications/email]`, `[notifications/whatsapp]`. Tous les chemins de bug critiques loggent maintenant explicitement.

## 6. Commandes utiles

```bash
# Re-déployer en forçant la pipeline (utile si tu viens d'ajouter une env var)
git commit --allow-empty -m "redeploy" && git push

# Vérifier en local avec les vars prod
cp .env.example .env
# remplir DATABASE_URL prod, USE_PRISMA=true, etc.
npm run build
npm run start
```
