const { getDb } = require("./db");
const { parseJson, isPromoActive, promoApplies, quoteTariff } = require("./pricing");

function mapPlan(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    features: parseJson(row.features_json, []),
    sort_order: row.sort_order,
    enabled: !!row.enabled,
  };
}

function mapDuration(row) {
  return {
    id: row.id,
    months: row.months,
    label: row.label,
    sort_order: row.sort_order,
    enabled: !!row.enabled,
  };
}

function mapTariff(row) {
  return {
    id: row.id,
    plan_id: row.plan_id,
    duration_id: row.duration_id,
    months: row.months,
    duration_label: row.duration_label,
    plan_slug: row.plan_slug,
    plan_name: row.plan_name,
    total_price_cents: row.total_price_cents,
    currency: row.currency,
    monthly_equivalent_cents: row.monthly_equivalent_cents,
    discount_percent: row.discount_percent,
    auto_renew_allowed: !!row.auto_renew_allowed,
    fixed_term_allowed: !!row.fixed_term_allowed,
    enabled: !!row.enabled,
  };
}

function mapPromo(row) {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    description: row.description,
    promo_type: row.promo_type,
    discount_percent: row.discount_percent,
    discount_amount_cents: row.discount_amount_cents,
    plan_id: row.plan_id,
    duration_id: row.duration_id,
    min_months: row.min_months,
    new_users_only: !!row.new_users_only,
    starts_at: row.starts_at,
    ends_at: row.ends_at,
    max_uses: row.max_uses,
    used_count: row.used_count,
    enabled: !!row.enabled,
  };
}

function getCatalog({ includeDisabled = false } = {}) {
  const db = getDb();
  const planFilter = includeDisabled ? "" : "WHERE enabled = 1";
  const durFilter = includeDisabled ? "" : "WHERE enabled = 1";
  const tariffFilter = includeDisabled
    ? ""
    : "WHERE t.enabled = 1 AND p.enabled = 1 AND d.enabled = 1";

  const plans = db
    .prepare(`SELECT * FROM plans ${planFilter} ORDER BY sort_order, id`)
    .all()
    .map(mapPlan);

  const durations = db
    .prepare(`SELECT * FROM durations ${durFilter} ORDER BY sort_order, months`)
    .all()
    .map(mapDuration);

  const tariffs = db
    .prepare(
      `SELECT t.*, d.months, d.label AS duration_label, p.slug AS plan_slug, p.name AS plan_name
       FROM plan_tariffs t
       JOIN durations d ON d.id = t.duration_id
       JOIN plans p ON p.id = t.plan_id
       ${tariffFilter}
       ORDER BY p.sort_order, d.sort_order`
    )
    .all()
    .map(mapTariff);

  const rules = db
    .prepare(`SELECT * FROM renewal_rules WHERE enabled = 1`)
    .all();

  const promos = db
    .prepare(`SELECT * FROM promotions ${includeDisabled ? "" : "WHERE enabled = 1"}`)
    .all()
    .map(mapPromo)
    .filter((p) => includeDisabled || isPromoActive(p));

  const featureMatrix = buildFeatureMatrix(plans);

  return { plans, durations, tariffs, renewal_rules: rules, promotions: promos, feature_matrix: featureMatrix };
}

function buildFeatureMatrix(plans) {
  const set = new Set();
  for (const p of plans) for (const f of p.features) set.add(f);
  const features = [...set];
  return {
    features,
    rows: features.map((feature) => ({
      feature,
      plans: Object.fromEntries(plans.map((p) => [p.slug, p.features.includes(feature)])),
    })),
  };
}

function findTariff(planSlugOrId, months) {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT t.*, d.months, d.label AS duration_label, p.slug AS plan_slug, p.name AS plan_name
       FROM plan_tariffs t
       JOIN durations d ON d.id = t.duration_id
       JOIN plans p ON p.id = t.plan_id
       WHERE t.enabled = 1 AND p.enabled = 1 AND d.enabled = 1
         AND d.months = ?
         AND (p.slug = ? OR p.id = ?)
       LIMIT 1`
    )
    .get(months, String(planSlugOrId), Number(planSlugOrId) || -1);
  return row ? mapTariff(row) : null;
}

function resolvePromo({ code, planId, durationMonths, durationId, isNewUser }) {
  const db = getDb();
  let candidates = [];
  if (code) {
    const row = db
      .prepare(`SELECT * FROM promotions WHERE upper(code) = upper(?) AND enabled = 1`)
      .get(code);
    if (row) candidates = [mapPromo(row)];
  } else {
    candidates = db
      .prepare(`SELECT * FROM promotions WHERE enabled = 1 AND (code IS NULL OR code = '')`)
      .all()
      .map(mapPromo);
  }

  const withMeta = candidates.map((p) => {
    let months = null;
    if (p.duration_id) {
      const d = db.prepare(`SELECT months FROM durations WHERE id = ?`).get(p.duration_id);
      months = d ? d.months : null;
    }
    return { ...p, _duration_months: months };
  });

  const matches = withMeta.filter((p) =>
    promoApplies(p, { planId, durationMonths, isNewUser })
  );
  if (durationId) {
    const exact = matches.find((p) => p.duration_id === durationId);
    if (exact) return exact;
  }
  return matches.sort((a, b) => (b.discount_percent || 0) - (a.discount_percent || 0))[0] || null;
}

function buildQuote({ planSlug, months, autoRenew, promoCode, email }) {
  const db = getDb();
  const tariff = findTariff(planSlug, months);
  if (!tariff) {
    const err = new Error("Tarif introuvable pour cette formule et durée.");
    err.status = 404;
    throw err;
  }
  if (autoRenew && !tariff.auto_renew_allowed) {
    const err = new Error("Le renouvellement automatique n’est pas disponible pour ce tarif.");
    err.status = 400;
    throw err;
  }
  if (!autoRenew && !tariff.fixed_term_allowed) {
    const err = new Error("La durée fixe n’est pas disponible pour ce tarif.");
    err.status = 400;
    throw err;
  }

  let isNewUser = true;
  if (email) {
    const user = db.prepare(`SELECT * FROM users WHERE lower(email) = lower(?)`).get(email);
    if (user) {
      const prior = db
        .prepare(`SELECT COUNT(*) AS c FROM subscriptions WHERE user_id = ?`)
        .get(user.id).c;
      isNewUser = prior === 0 || !!user.is_new;
    }
  }

  const promo = resolvePromo({
    code: promoCode || null,
    planId: tariff.plan_id,
    durationMonths: tariff.months,
    durationId: tariff.duration_id,
    isNewUser,
  });

  // Also try automatic (no-code) promos if code didn't match / wasn't provided
  let effectivePromo = promo;
  if (!promoCode) {
    effectivePromo = resolvePromo({
      code: null,
      planId: tariff.plan_id,
      durationMonths: tariff.months,
      durationId: tariff.duration_id,
      isNewUser,
    });
  }

  const priced = quoteTariff(tariff, effectivePromo);
  const start = new Date();
  const { addMonths } = require("./pricing");
  const end = addMonths(start.toISOString(), tariff.months);

  const rule = db
    .prepare(
      `SELECT * FROM renewal_rules WHERE enabled = 1 AND (plan_id = ? OR plan_id IS NULL)
       ORDER BY plan_id DESC LIMIT 1`
    )
    .get(tariff.plan_id);

  const renewalDate = autoRenew ? end : null;
  const terms = autoRenew
    ? rule?.terms_fr ||
      "Renouvellement automatique à la fin de la période pour la même durée, sauf résiliation préalable."
    : "Abonnement à durée fixe : aucun renouvellement automatique. L’accès prend fin à la date indiquée.";

  return {
    plan: {
      id: tariff.plan_id,
      slug: tariff.plan_slug,
      name: tariff.plan_name,
    },
    duration: {
      id: tariff.duration_id,
      months: tariff.months,
      label: tariff.duration_label,
    },
    tariff_id: tariff.id,
    auto_renew: !!autoRenew,
    commitment_model: autoRenew ? "auto_renew" : "fixed_term",
    pricing: priced,
    promo: effectivePromo
      ? {
          id: effectivePromo.id,
          code: effectivePromo.code,
          name: effectivePromo.name,
          description: effectivePromo.description,
          promo_type: effectivePromo.promo_type,
        }
      : null,
    start_at: start.toISOString(),
    end_at: end,
    renewal_at: renewalDate,
    renewal_terms_fr: terms,
  };
}

module.exports = {
  getCatalog,
  mapPlan,
  mapDuration,
  mapTariff,
  mapPromo,
  findTariff,
  resolvePromo,
  buildQuote,
};
