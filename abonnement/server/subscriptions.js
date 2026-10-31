const { getDb } = require("./db");
const { addMonths, parseJson } = require("./pricing");
const { buildQuote, findTariff } = require("./catalog");

function ensureUser(email, displayName = "") {
  const db = getDb();
  const existing = db.prepare(`SELECT * FROM users WHERE lower(email) = lower(?)`).get(email);
  if (existing) return existing;
  const r = db
    .prepare(`INSERT INTO users (email, display_name, is_new) VALUES (?, ?, 1)`)
    .run(email.trim().toLowerCase(), displayName || "");
  return db.prepare(`SELECT * FROM users WHERE id = ?`).get(r.lastInsertRowid);
}

function mapSubscription(row) {
  return {
    id: row.id,
    user_id: row.user_id,
    email: row.email,
    plan: { id: row.plan_id, slug: row.plan_slug, name: row.plan_name },
    duration: { id: row.duration_id, months: row.months, label: row.duration_label },
    tariff_id: row.tariff_id,
    promo_id: row.promo_id,
    auto_renew: !!row.auto_renew,
    commitment_model: row.auto_renew ? "auto_renew" : "fixed_term",
    start_at: row.start_at,
    end_at: row.end_at,
    status: row.status,
    renewal_terms_fr: row.renewal_terms_fr,
    created_at: row.created_at,
    cancelled_at: row.cancelled_at,
  };
}

function getSubscriptionById(id) {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT s.*, u.email, p.slug AS plan_slug, p.name AS plan_name,
              d.months, d.label AS duration_label
       FROM subscriptions s
       JOIN users u ON u.id = s.user_id
       JOIN plans p ON p.id = s.plan_id
       JOIN durations d ON d.id = s.duration_id
       WHERE s.id = ?`
    )
    .get(id);
  return row ? mapSubscription(row) : null;
}

function listSubscriptions({ email, status } = {}) {
  const db = getDb();
  let sql = `
    SELECT s.*, u.email, p.slug AS plan_slug, p.name AS plan_name,
           d.months, d.label AS duration_label
    FROM subscriptions s
    JOIN users u ON u.id = s.user_id
    JOIN plans p ON p.id = s.plan_id
    JOIN durations d ON d.id = s.duration_id
    WHERE 1=1`;
  const params = [];
  if (email) {
    sql += ` AND lower(u.email) = lower(?)`;
    params.push(email);
  }
  if (status) {
    sql += ` AND s.status = ?`;
    params.push(status);
  }
  sql += ` ORDER BY s.created_at DESC`;
  return db.prepare(sql).all(...params).map(mapSubscription);
}

function createSubscription({
  email,
  displayName,
  planSlug,
  months,
  autoRenew,
  promoCode,
}) {
  const db = getDb();
  const quote = buildQuote({
    planSlug,
    months,
    autoRenew: !!autoRenew,
    promoCode,
    email,
  });
  const user = ensureUser(email, displayName);

  const insertSub = db.prepare(`
    INSERT INTO subscriptions (
      user_id, plan_id, duration_id, tariff_id, promo_id,
      auto_renew, start_at, end_at, status, renewal_terms_fr
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', ?)
  `);
  const insertTx = db.prepare(`
    INSERT INTO transactions (
      subscription_id, user_id, tx_type, amount_cents, currency, status, meta_json
    ) VALUES (?, ?, 'purchase', ?, ?, 'succeeded', ?)
  `);

  const result = db.exec("BEGIN");
  void result;
  try {
    const subR = insertSub.run(
      user.id,
      quote.plan.id,
      quote.duration.id,
      quote.tariff_id,
      quote.promo?.id || null,
      autoRenew ? 1 : 0,
      quote.start_at,
      quote.end_at,
      quote.renewal_terms_fr
    );
    const subId = Number(subR.lastInsertRowid);
    insertTx.run(
      subId,
      user.id,
      quote.pricing.total_price_cents,
      quote.pricing.currency,
      JSON.stringify({
        commitment_model: quote.commitment_model,
        promo: quote.promo,
        months: quote.duration.months,
        plan: quote.plan.slug,
      })
    );
    if (quote.promo?.id) {
      db.prepare(`UPDATE promotions SET used_count = used_count + 1, updated_at = datetime('now') WHERE id = ?`).run(
        quote.promo.id
      );
    }
    db.prepare(`UPDATE users SET is_new = 0 WHERE id = ?`).run(user.id);
    db.exec("COMMIT");
    return { subscription: getSubscriptionById(subId), quote };
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
}

function cancelSubscription(id, { immediate = false } = {}) {
  const db = getDb();
  const sub = getSubscriptionById(id);
  if (!sub) {
    const err = new Error("Abonnement introuvable.");
    err.status = 404;
    throw err;
  }
  if (sub.status === "cancelled" || sub.status === "expired") {
    const err = new Error("Cet abonnement est déjà clôturé.");
    err.status = 400;
    throw err;
  }

  const now = new Date().toISOString();
  if (immediate || !sub.auto_renew) {
    db.prepare(
      `UPDATE subscriptions SET status = 'cancelled', cancelled_at = ?, auto_renew = 0, end_at = ?, updated_at = datetime('now') WHERE id = ?`
    ).run(now, now, id);
  } else {
    // Auto-renew: stop renewal but keep access until end_at
    db.prepare(
      `UPDATE subscriptions SET auto_renew = 0, cancelled_at = ?, status = 'active_until_end', updated_at = datetime('now') WHERE id = ?`
    ).run(now, id);
  }

  db.prepare(
    `INSERT INTO transactions (subscription_id, user_id, tx_type, amount_cents, currency, status, meta_json)
     VALUES (?, ?, 'cancellation', 0, 'EUR', 'succeeded', ?)`
  ).run(
    id,
    sub.user_id,
    JSON.stringify({ immediate, previous_model: sub.commitment_model })
  );

  return getSubscriptionById(id);
}

function extendSubscription(id, { months, promoCode } = {}) {
  const db = getDb();
  const sub = getSubscriptionById(id);
  if (!sub || !["active", "active_until_end"].includes(sub.status)) {
    const err = new Error("Abonnement non prolongeable.");
    err.status = 400;
    throw err;
  }
  const extraMonths = Number(months) || sub.duration.months;
  const tariff = findTariff(sub.plan.slug, extraMonths);
  if (!tariff) {
    const err = new Error("Tarif de prolongation introuvable.");
    err.status = 404;
    throw err;
  }
  const quote = buildQuote({
    planSlug: sub.plan.slug,
    months: extraMonths,
    autoRenew: false,
    promoCode,
    email: sub.email,
  });
  const newEnd = addMonths(sub.end_at, extraMonths);
  db.prepare(
    `UPDATE subscriptions SET end_at = ?, status = 'active', updated_at = datetime('now') WHERE id = ?`
  ).run(newEnd, id);
  db.prepare(
    `INSERT INTO transactions (subscription_id, user_id, tx_type, amount_cents, currency, status, meta_json)
     VALUES (?, ?, 'extension', ?, ?, 'succeeded', ?)`
  ).run(
    id,
    sub.user_id,
    quote.pricing.total_price_cents,
    quote.pricing.currency,
    JSON.stringify({ months: extraMonths, promo: quote.promo })
  );
  if (quote.promo?.id) {
    db.prepare(`UPDATE promotions SET used_count = used_count + 1 WHERE id = ?`).run(quote.promo.id);
  }
  return { subscription: getSubscriptionById(id), quote };
}

function changePlan(id, { planSlug, months, autoRenew, promoCode }) {
  const db = getDb();
  const sub = getSubscriptionById(id);
  if (!sub || !["active", "active_until_end"].includes(sub.status)) {
    const err = new Error("Changement de formule impossible.");
    err.status = 400;
    throw err;
  }
  const quote = buildQuote({
    planSlug,
    months: months || sub.duration.months,
    autoRenew: autoRenew != null ? !!autoRenew : sub.auto_renew,
    promoCode,
    email: sub.email,
  });
  const start = new Date().toISOString();
  db.prepare(
    `UPDATE subscriptions SET
      plan_id = ?, duration_id = ?, tariff_id = ?, promo_id = ?,
      auto_renew = ?, start_at = ?, end_at = ?, status = 'active',
      renewal_terms_fr = ?, cancelled_at = NULL, updated_at = datetime('now')
     WHERE id = ?`
  ).run(
    quote.plan.id,
    quote.duration.id,
    quote.tariff_id,
    quote.promo?.id || null,
    quote.auto_renew ? 1 : 0,
    start,
    quote.end_at,
    quote.renewal_terms_fr,
    id
  );
  db.prepare(
    `INSERT INTO transactions (subscription_id, user_id, tx_type, amount_cents, currency, status, meta_json)
     VALUES (?, ?, 'plan_change', ?, ?, 'succeeded', ?)`
  ).run(
    id,
    sub.user_id,
    quote.pricing.total_price_cents,
    quote.pricing.currency,
    JSON.stringify({
      from: sub.plan.slug,
      to: quote.plan.slug,
      commitment_model: quote.commitment_model,
    })
  );
  return { subscription: getSubscriptionById(id), quote };
}

function listTransactions({ subscriptionId, email } = {}) {
  const db = getDb();
  let sql = `
    SELECT t.*, u.email FROM transactions t
    JOIN users u ON u.id = t.user_id
    WHERE 1=1`;
  const params = [];
  if (subscriptionId) {
    sql += ` AND t.subscription_id = ?`;
    params.push(subscriptionId);
  }
  if (email) {
    sql += ` AND lower(u.email) = lower(?)`;
    params.push(email);
  }
  sql += ` ORDER BY t.created_at DESC`;
  return db.prepare(sql).all(...params).map((row) => ({
    id: row.id,
    subscription_id: row.subscription_id,
    email: row.email,
    tx_type: row.tx_type,
    amount_cents: row.amount_cents,
    currency: row.currency,
    status: row.status,
    meta: parseJson(row.meta_json, {}),
    created_at: row.created_at,
  }));
}

module.exports = {
  ensureUser,
  getSubscriptionById,
  listSubscriptions,
  createSubscription,
  cancelSubscription,
  extendSubscription,
  changePlan,
  listTransactions,
};
