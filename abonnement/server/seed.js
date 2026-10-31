const { getDb, resetDb } = require("./db");

const PLAN_FEATURES = {
  plus: [
    "Accès aux contenus Plus",
    "Support e-mail sous 48 h",
    "1 appareil simultané",
    "Historique 30 jours",
  ],
  premium: [
    "Tout Plus inclus",
    "Contenus Premium exclusifs",
    "Support prioritaire sous 24 h",
    "3 appareils simultanés",
    "Historique illimité",
    "Exports CSV",
  ],
  elite: [
    "Tout Premium inclus",
    "Accès Elite anticipé",
    "Support dédié",
    "Appareils illimités",
    "API personnelle",
    "Rapports analytics avancés",
  ],
};

/** Base monthly prices in cents (1-month list price). Longer periods get progressive discounts. */
const BASE_MONTHLY = { plus: 699, premium: 999, elite: 1499 };

/** Discount % vs paying N × monthly list price */
const DURATION_DISCOUNTS = {
  1: 0,
  2: 7,
  3: 13,
  6: 20,
  9: 26,
  12: 33,
  24: 40,
};

function cents(n) {
  return Math.round(n);
}

function seed(options = {}) {
  const db = options.reset ? resetDb() : getDb();

  const planCount = db.prepare("SELECT COUNT(*) AS c FROM plans").get().c;
  if (planCount > 0 && !options.force) {
    console.log("Database already seeded. Use force=true to reseed.");
    return db;
  }

  if (options.force) resetDb();
  const fresh = getDb();

  const insertPlan = fresh.prepare(`
    INSERT INTO plans (slug, name, tagline, features_json, sort_order, enabled)
    VALUES (?, ?, ?, ?, ?, 1)
  `);
  const insertDuration = fresh.prepare(`
    INSERT INTO durations (months, label, sort_order, enabled)
    VALUES (?, ?, ?, 1)
  `);
  const insertTariff = fresh.prepare(`
    INSERT INTO plan_tariffs (
      plan_id, duration_id, total_price_cents, currency,
      monthly_equivalent_cents, discount_percent,
      auto_renew_allowed, fixed_term_allowed, enabled
    ) VALUES (?, ?, ?, 'EUR', ?, ?, 1, 1, 1)
  `);
  const insertRule = fresh.prepare(`
    INSERT INTO renewal_rules (plan_id, duration_id, auto_renew_default, notice_days, terms_fr, enabled)
    VALUES (?, NULL, 0, 7, ?, 1)
  `);
  const insertPromo = fresh.prepare(`
    INSERT INTO promotions (
      code, name, description, promo_type, discount_percent, discount_amount_cents,
      plan_id, duration_id, min_months, new_users_only, starts_at, ends_at, max_uses, enabled
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `);

  const plans = [
    ["plus", "Plus", "L’essentiel pour démarrer", PLAN_FEATURES.plus, 1],
    ["premium", "Premium", "Le meilleur équilibre prix / avantages", PLAN_FEATURES.premium, 2],
    ["elite", "Elite", "Puissance maximale sans compromis", PLAN_FEATURES.elite, 3],
  ];

  const planIds = {};
  for (const [slug, name, tagline, features, sort] of plans) {
    const r = insertPlan.run(slug, name, tagline, JSON.stringify(features), sort);
    planIds[slug] = Number(r.lastInsertRowid);
  }

  const durationIds = {};
  const monthsList = [1, 2, 3, 6, 9, 12, 24];
  monthsList.forEach((m, i) => {
    const label = m === 1 ? "1 mois" : `${m} mois`;
    const r = insertDuration.run(m, label, i + 1);
    durationIds[m] = Number(r.lastInsertRowid);
  });

  for (const [slug, base] of Object.entries(BASE_MONTHLY)) {
    const planId = planIds[slug];
    for (const months of monthsList) {
      const discount = DURATION_DISCOUNTS[months];
      const listTotal = base * months;
      const total = cents(listTotal * (1 - discount / 100));
      const monthlyEq = cents(total / months);
      insertTariff.run(
        planId,
        durationIds[months],
        total,
        monthlyEq,
        discount
      );
    }
    insertRule.run(
      planId,
      "Renouvellement automatique : vous serez débité à la date de renouvellement pour une période identique, sauf résiliation depuis votre compte au moins 7 jours avant. Abonnement à durée fixe : aucun renouvellement automatique ; l’accès s’arrête à la date de fin."
    );
  }

  const now = new Date();
  const in30 = new Date(now.getTime() + 30 * 864e5).toISOString();
  const in90 = new Date(now.getTime() + 90 * 864e5).toISOString();
  const started = new Date(now.getTime() - 7 * 864e5).toISOString();

  insertPromo.run(
    "BIENVENUE20",
    "Bienvenue nouveaux utilisateurs",
    "−20 % pour la première souscription. Offre claire, sans engagement caché.",
    "new_user",
    20,
    null,
    null,
    null,
    null,
    1,
    started,
    in90,
    1000
  );
  insertPromo.run(
    "LONG12",
    "Engagement long 12 mois+",
    "Réduction supplémentaire −5 % sur les durées de 12 mois et plus.",
    "long_period",
    5,
    null,
    null,
    null,
    12,
    0,
    started,
    in90,
    null
  );
  insertPromo.run(
    "LANCEMENT",
    "Offre de lancement",
    "Promotion temporaire de lancement : −15 % sur Premium.",
    "launch",
    15,
    null,
    planIds.premium,
    null,
    null,
    0,
    started,
    in30,
    500
  );
  insertPromo.run(
    null,
    "Promo temporaire site",
    "Promotion événementielle affichée sans code : −10 % Elite 6 mois.",
    "event",
    10,
    null,
    planIds.elite,
    durationIds[6],
    null,
    0,
    started,
    in30,
    null
  );

  console.log("Seeded plans Plus / Premium / Elite with flexible durations.");
  return fresh;
}

if (require.main === module) {
  seed({ force: process.argv.includes("--force") });
}

module.exports = { seed, BASE_MONTHLY, DURATION_DISCOUNTS };
