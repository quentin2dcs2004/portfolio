# Abonnement API + admin (web)

Backend SQLite + Express pour le catalogue **Plus / Premium / Elite** à durées flexibles.
L’app mobile Expo (`../mobile`) consomme cette API — aucun prix n’est hardcodé dans l’UI.

## Démarrer

```bash
cd abonnement
npm install
npm start
```

- API + pages web : http://localhost:3847  
- Souscrire (web démo) : http://localhost:3847/  
- Compte : http://localhost:3847/compte.html  
- **Admin** : http://localhost:3847/admin.html (jeton par défaut `quentin-admin`, override `ADMIN_TOKEN`)

Reseed forcé :

```bash
npm run seed -- --force
```

## Admin — configurer les durées

1. Ouvrir `/admin.html`, coller le jeton, **Charger**.
2. Onglet **Durées** : ajouter / activer / désactiver (1, 2, 3, 6, 9, 12, 24…).
3. Onglet **Tarifs** : pour chaque formule × durée, fixer prix total (centimes), devise, % réduction.
4. Onglet **Promotions** : programmer codes / offres (new_user, long_period, launch, event…).
5. **Analytics** + export CSV des souscriptions / revenus.

## Décision CDC

Aucun système d’abonnement n’existait dans le portfolio (site HTML statique).  
Ce module **crée** Plus / Premium / Elite + durées flexibles selon le CDC, avec admin dynamique et client **mobile** prioritaire.
