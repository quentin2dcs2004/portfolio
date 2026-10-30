# Portfolio — Quentin DA COSTA SOARES

Site portfolio statique (HTML / CSS / JS) avec **Three.js** en expérience visuelle principale.

## Concept produit

1. **Accueil** (`index.html`) — intro **Netflix lettre Q** (premium) → hero type [YouTube portfolio](https://www.youtube.com/watch?v=-u3vE84Wo_U&t=2s) (portrait rond + « Salut, c’est Quentin » + typing FR) + Three.js. Textes en français.
2. **Projets** (`projets.html`) — **livre enchanté** interactif (esprit Minecraft enchant / glow runique)
3. **Phone** (`cyber.html`) — téléphone premium à l’écran : **projets virtuels** + **conversation MP** (questions présélectionnées, réponses préparées, pas de backend)

## Lancer en local (preview pour l’instant)

**Localhost only** pendant le build / review — pas de GitHub Pages / Netlify / deploy public pour le moment (preview en ligne plus tard).

Aucun build requis. À la racine du repo :

```bash
python3 -m http.server 8080
```

Ouvrir [http://localhost:8080](http://localhost:8080) dans le navigateur.

| Page | URL locale |
|------|------------|
| Accueil | http://localhost:8080/ |
| Livre enchanté | http://localhost:8080/projets.html |
| Phone (projets + MP) | http://localhost:8080/cyber.html |
| Mon histoire | http://localhost:8080/about.html |

## Photos — placeholders uniquement (pour l’instant)

**Ship sans vraies photos.** Les portraits utilisent `image/placeholder-portrait.svg` (libellé placeholder visible).

Quand Quentin aura le dossier photo sur le bureau :

1. Copier les fichiers dans `image/` (ex. `quentin-hero.jpg`, `quentin-portrait.jpg`)
2. Remplacer les `src` dans `index.html` (hero + section Passions) qui pointent vers `image/placeholder-portrait.svg`
3. L’ancien `image/votre-photo.jpg` peut rester ou être retiré — ce n’est plus référencé par les pages actives

Projets du livre + textes Phone / MP : aussi marqués **Placeholder**.

## Three.js

CDN `three@0.170.0` (jsDelivr).

- `js/three-scenes.js` — intro, hero, orbite ; palette enchant violette sur la page livre
- `js/phone.js` — apps du téléphone (projets + MP)
