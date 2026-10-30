# Portfolio — Quentin DA COSTA SOARES

Site portfolio statique (HTML / CSS / JS) avec **Three.js** en expérience visuelle principale.

## Concept produit

1. **Accueil** (`index.html`) — hero perso (placeholder photo + intro courte) + Three.js full-bleed
2. **Projets** (`projets.html`) — **livre enchanté** interactif (esprit Minecraft enchant / glow runique)
3. **Stories** (`cyber.html`) — feed / stories cyberpunk style Instagram + **Q&A** préparé (pas de backend)

## Lancer en local

Aucun build requis. Servir en HTTP (modules ES + import map Three.js) :

```bash
python3 -m http.server 8080
# ou : npx --yes serve -l 8080
```

→ [http://localhost:8080](http://localhost:8080)

| Page | URL |
|------|-----|
| Accueil | `/` |
| Livre enchanté | `/projets.html` |
| Stories cyber Q&A | `/cyber.html` |
| Mon histoire | `/about.html` |

## Photos — placeholders uniquement (pour l’instant)

**Ship sans vraies photos.** Les portraits utilisent `image/placeholder-portrait.svg` (libellé placeholder visible).

Quand Quentin aura le dossier photo sur le bureau :

1. Copier les fichiers dans `image/` (ex. `quentin-hero.jpg`, `quentin-portrait.jpg`)
2. Remplacer les `src` dans `index.html` (hero + section Passions) qui pointent vers `image/placeholder-portrait.svg`
3. L’ancien `image/votre-photo.jpg` peut rester ou être retiré — ce n’est plus référencé par les pages actives

Projets du livre + textes Stories / Q&A : aussi marqués **Placeholder**.

## Three.js

CDN `three@0.170.0` (jsDelivr).

- `js/three-scenes.js` — intro, hero, orbite ; palette enchant violette sur la page livre
- `js/cyber.js` — fond néon Stories
