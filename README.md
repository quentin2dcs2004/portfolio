# Portfolio — Quentin DA COSTA SOARES

Site portfolio statique (HTML / CSS / JS) avec **Three.js** en expérience visuelle principale.

## Concept produit

1. **Accueil** (`index.html`) — identité forte, Three.js full-bleed + animations
2. **Projets** (`projets.html`) — **livre interactif** (pages qui tournent), pas une grille de cards
3. **Stories** (`cyber.html`) — feed / stories **cyberpunk style Instagram** avec **Q&A** (questions à choisir, réponses préparées, pas de backend)

## Lancer en local

Aucun build requis. Il faut un serveur HTTP (modules ES + import map Three.js).

```bash
# Option A — Python
python3 -m http.server 8080

# Option B — Node
npx --yes serve -l 8080
```

Ouvrir [http://localhost:8080](http://localhost:8080).

| Page | URL |
|------|-----|
| Accueil | `/` ou `/index.html` |
| Livre projets | `/projets.html` |
| Stories cyber Q&A | `/cyber.html` |
| Mon histoire | `/about.html` |

## Three.js

CDN `three@0.170.0` (jsDelivr).

- `js/three-scenes.js` — intro particules, fond hero (torus knot + champ), orbite section
- `js/cyber.js` — fond néon / grille pour la page Stories

## Placeholders

Les projets du livre et certains textes Stories / Q&A sont marqués **Placeholder** — à remplacer par le contenu réel de Quentin.
