# Tempo — déploiement Vercel + Neon

Sondage de disponibilités (façon Doodle), **web + PWA installable** sur iOS/Android.
Front statique + fonctions serverless (`/api`) + base **Neon (Postgres)**.

```
tempo/
├─ index.html              # l'app (front)
├─ favicon.svg             # favicon (logo Tempo)
├─ manifest.webmanifest    # PWA
├─ service-worker.js       # cache du shell, jamais l'API
├─ vercel.json             # en-têtes
├─ package.json            # dépendance @neondatabase/serverless
├─ schema.sql              # tables Postgres (à exécuter une fois)
├─ icons/                  # icônes PWA (192, 512, apple-touch 180) — incluses
└─ api/
   ├─ _db.js               # client Neon
   ├─ events.js            # POST créer / GET lire un évènement
   └─ responses.js         # GET lister / POST enregistrer une réponse
```

## 1) Base de données Neon
1. Crée un projet sur https://neon.tech (plan gratuit).
2. Ouvre **SQL Editor** et colle le contenu de `schema.sql`, exécute.
3. Copie la **connection string** (Dashboard → Connection Details), format
   `postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require`.

## 2) Pousser le repo sur GitHub
```bash
cd tempo
git init
git add .
git commit -m "Tempo — version prod"
git branch -M main
git remote add origin https://github.com/<toi>/tempo.git
git push -u origin main
```

## 3) Déployer sur Vercel
1. https://vercel.com → **Add New… → Project** → importe le repo GitHub `tempo`.
2. Framework Preset : **Other** (rien à configurer, pas de build).
3. **Environment Variables** → ajoute :
   - `DATABASE_URL` = ta connection string Neon.
   *(ou utilise l'intégration Vercel↔Neon : Vercel → Integrations → Neon, elle pose `DATABASE_URL` toute seule.)*
4. **Deploy**. Ton app est en ligne sur `https://<projet>.vercel.app`.

Les liens d'évènement sont de la forme `https://<projet>.vercel.app/#e=xxxx` — permanents,
partageables, consultables à tout moment. Les réponses se rafraîchissent toutes les ~4 s.

## 4) Icônes — déjà incluses ✅
Tout est prêt, rien à faire :
- `favicon.svg` — favicon de l'onglet (desktop) ;
- `icons/icon-192.png`, `icons/icon-512.png` — icônes PWA (Android) + `manifest.webmanifest` ;
- `icons/apple-touch-icon.png` (180×180) — icône d'écran d'accueil **iOS**.

Les PNG sont des rendus plein cadre du logo (`#003D3D`) ; iOS et Android leur appliquent
automatiquement leur masque arrondi. Pour changer le logo plus tard, remplace `favicon.svg`
et régénère les PNG (ou exporte-les depuis Figma aux mêmes tailles).

## Développer en local (optionnel)
```bash
npm i
npm i -g vercel
vercel dev          # sert le front + les fonctions, avec DATABASE_URL dans .env
```

## Notes
- **Sécurité** : comme Doodle, un lien public est modifiable par quiconque l'a. Simple par
  design. On peut ajouter un jeton d'édition par réponse et une limitation de débit si besoin.
- **Neon gratuit** : la base se met en veille après ~5 min d'inactivité et se réveille à la
  première requête (léger délai au premier chargement). Aucune donnée perdue.
- **Coût** : gratuit à petite échelle (Vercel Hobby non commercial + Neon Free).
