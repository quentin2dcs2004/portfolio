# Portfolio + abonnements flexibles (mobile)

Repo portfolio de Quentin. **Aucun système d’abonnement n’existait** (site HTML statique) — ce travail ajoute :

| Dossier | Rôle |
|---------|------|
| `mobile/` | **App téléphone** Expo / React Native — souscription prioritaire |
| `abonnement/` | API SQLite + back-office web (durées, tarifs, promos, analytics) |
| `*.html` | Portfolio web historique |

## Démarrage rapide

```bash
# 1. API (port 3847)
cd abonnement && npm install && npm start

# 2. App mobile (autre terminal)
cd mobile && npm install && npm start
```

Détails device / simulateur : [`mobile/README.md`](mobile/README.md)  
Admin (durées & prix) : [`abonnement/README.md`](abonnement/README.md)
