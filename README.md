# Quentin — Create Your Own Universe

Portfolio immersif (React · TypeScript · Vite · Tailwind · Three.js · Framer Motion).

## Signature

**QUENTIN – CREATE YOUR OWN UNIVERSE.**

## Lancer en local

```bash
npm install
npm run dev
```

Ouvre l’URL Vite affichée (souvent http://localhost:5173).

```bash
npm run build
npm run preview
```

## Rubriques

| Route | Page |
|-------|------|
| `/` | Accueil + intro Netflix Q + galaxie Three.js |
| `/apprendre` | Compétences (graphisme → conseil) |
| `/story` | Messagerie type Instagram DM |
| `/projets` | Galerie filtrable + modal immersive |
| `/portfolio` | Livre numérique interactif |
| `/materiel` | Fiches équipement |
| `/parcours` | Timeline |
| `/passions` | Galerie passions |
| `/laboratoire` | Expérimentations |
| `/contact` | Formulaire validé (mailto) |

## Contenu modifiable

Tout le contenu éditorial : `src/data/site.ts`  
Photo : `public/images/quentin.jpg`

Les projets / matériel / pages livre marqués « à compléter » ou Placeholder sont des emplacements volontaires — ne pas inventer d’expériences.

## Intro

L’intro cinématique Q se joue une fois par session (`sessionStorage`). Bouton **Passer l’intro** toujours disponible. Respect de `prefers-reduced-motion`.
