# Meetora — app mobile (Expo / React Native)

Client **téléphone** Meetora pour souscrire à Plus / Premium / Elite avec durées flexibles.
Les tarifs et durées viennent de l’API `../abonnement` (jamais hardcodés dans l’UI).

## Prérequis

1. Node 22+
2. API démarrée : `cd ../abonnement && npm start` (port **3847**)
3. Expo Go sur un téléphone, **ou** simulateur iOS / émulateur Android

## Lancer

```bash
cd mobile
npm install
npm start
```

Puis :

- Scanner le QR avec **Expo Go** (même réseau Wi‑Fi), **ou**
- `a` pour Android emulator, `i` pour iOS simulator (macOS), `w` pour web preview

### URL API sur appareil physique

Par défaut :

- iOS simulator / web → `http://localhost:3847`
- Android emulator → `http://10.0.2.2:3847`

Sur un **vrai téléphone**, pointez vers l’IP de votre machine :

```bash
EXPO_PUBLIC_API_URL=http://192.168.1.20:3847 npm start
```

## Parcours

1. **Souscrire** — formules, sélecteur de durée, prix total / mensuel / économies, fin & renouvellement, durée fixe vs auto-renouvellement, code promo, CTA.
2. **Compte** — voir abonnements, prolonger, résilier (stop renouvellement vs fin immédiate), historique.

L’admin reste sur le **web** (`../abonnement` → `/admin.html`).
