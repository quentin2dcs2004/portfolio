const { getDb } = require("./db");
const { mapPlan, mapDuration, mapTariff, mapPromo } = require("./catalog");

function touch() {
  return new Date().toISOString().replace("T", " ").slice(0, 19);
}

function listAllAdmin() {
  const db = getDb();
  const plans = db.prepare(`SELECT * FROM plans ORDER BY sort_order`).all().map(mapPlan);
  const durations = db
    .prepare(`SELECT * FROM durations ORDER BY sort_order`)
    .all()
    .map(mapDuration);
  const tariffs = db
    .prepare(
      `SELECT t.*, d.months, d.label AS duration_label, p.slug AS plan_slug, p.name AS plan_name
       FROM plan_tariffs t
       JOIN durations d ON d.id = t.duration_id
       JOIN plans p ON p.id = t.plan_id
       ORDER BY p.sort_order, d.sort_order`
    )
    .all()
    .map(mapTariff);
  const promotions = db
    .prepare(`SELECT * FROM promotions ORDER BY created_at DESC`)
    .all()
    .map(mapPromo);
  const renewal_rules = db.prepare(`SELECT * FROM renewal_rules ORDER BY id`).all();
  return { plans, durations, tariffs, promotions, renewal_rules };
}

function upsertDuration(body) {
  const db = getDb();
  const months = Number(body.months);
  if (!months || months < 1) {
    const err = new Error("Durée invalide (mois).");
    err.status = 400;
    throw err;
  }
  const label = body.label || `${months} mois`;
  const enabled = body.enabled === false || body.enabled === 0 ? 0 : 1;
  const sort = body.sort_order != null ? Number(body.sort_order) : months;

  if (body.id) {
    db.prepare(
      `UPDATE durations SET months=?, label=?, sort_order=?, enabled=?, updated_at=datetime('now') WHERE id=?`
    ).run(months, label, sort, enabled, body.id);
    return db.prepare(`SELECT * FROM durations WHERE id=?`).get(body.id);
  }
  const existing = db.prepare(`SELECT id FROM durations WHERE months=?`).get(months);
  if (existing) {
    db.prepare(
      `UPDATE durations SET label=?, sort_order=?, enabled=?, updated_at=datetime('now') WHERE id=?`
    ).run(label, sort, enabled, existing.id);
    return db.prepare(`SELECT * FROM durations WHERE id=?`).get(existing.id);
  }
  const r = db
    .prepare(`INSERT INTO durations (months, label, sort_order, enabled) VALUES (?,?,?,?)`)
    .run(months, label, sort, enabled);
  return db.prepare(`SELECT * FROM durations WHERE id=?`).get(r.lastInsertRowid);
}

function upsertTariff(body) {
  const db = getDb();
  const planId = Number(body.plan_id);
  const durationId = Number(body.duration_id);
  const total = Number(body.total_price_cents);
  const currency = body.currency || "EUR";
  if (!planId || !durationId || !Number.isFinite(total)) {
    const err = new Error("plan_id, duration_id et total_price_cents requis.");
    err.status = 400;
    throw err;
  }
  const duration = db.prepare(`SELECT months FROM durations WHERE id=?`).get(durationId);
  if (!duration) {
    const err = new Error("Durée introuvable.");
    err.status = 404;
    throw err;
  }
  const monthly =
    body.monthly_equivalent_cents != null
      ? Number(body.monthly_equivalent_cents)
      : Math.round(total / duration.months);
  const discount = body.discount_percent != null ? Number(body.discount_percent) : 0;
  const enabled = body.enabled === false || body.enabled === 0 ? 0 : 1;
  const autoRenew = body.auto_renew_allowed === false || body.auto_renew_allowed === 0 ? 0 : 1;
  const fixed = body.fixed_term_allowed === false || body.fixed_term_allowed === 0 ? 0 : 1;

  const existing = db
    .prepare(`SELECT id FROM plan_tariffs WHERE plan_id=? AND duration_id=?`)
    .get(planId, durationId);

  if (body.id || existing) {
    const id = body.id || existing.id;
    db.prepare(
      `UPDATE plan_tariffs SET
        total_price_cents=?, currency=?, monthly_equivalent_cents=?, discount_percent=?,
        auto_renew_allowed=?, fixed_term_allowed=?, enabled=?, updated_at=datetime('now')
       WHERE id=?`
    ).run(total, currency, monthly, discount, autoRenew, fixed, enabled, id);
    return db
      .prepare(
        `SELECT t.*, d.months, d.label AS duration_label, p.slug AS plan_slug, p.name AS plan_name
         FROM plan_tariffs t JOIN durations d ON d.id=t.duration_id JOIN plans p ON p.id=t.plan_id
         WHERE t.id=?`
      )
      .get(id);
  }

  const r = db
    .prepare(
      `INSERT INTO plan_tariffs (
        plan_id, duration_id, total_price_cents, currency, monthly_equivalent_cents,
        discount_percent, auto_renew_allowed, fixed_term_allowed, enabled
      ) VALUES (?,?,?,?,?,?,?,?,?)`
    )
    .run(planId, durationId, total, currency, monthly, discount, autoRenew, fixed, enabled);
  return db
    .prepare(
      `SELECT t.*, d.months, d.label AS duration_label, p.slug AS plan_slug, p.name AS plan_name
       FROM plan_tariffs t JOIN durations d ON d.id=t.duration_id JOIN plans p ON p.id=t.plan_id
       WHERE t.id=?`
    )
    .get(r.lastInsertRowid);
}

function upsertPromotion(body) {
  const db = getDb();
  const enabled = body.enabled === false || body.enabled === 0 ? 0 : 1;
  const fields = [
    body.code || null,
    body.name,
    body.description || "",
    body.promo_type || "temporary",
    body.discount_percent != null ? Number(body.discount_percent) : null,
    body.discount_amount_cents != null ? Number(body.discount_amount_cents) : null,
    body.plan_id || null,
    body.duration_id || null,
    body.min_months != null ? Number(body.min_months) : null,
    body.new_users_only ? 1 : 0,
    body.starts_at || null,
    body.ends_at || null,
    body.max_uses != null ? Number(body.max_uses) : null,
    enabled,
  ];
  if (!body.name) {
    const err = new Error("name requis.");
    err.status = 400;
    throw err;
  }
  if (body.id) {
    db.prepare(
      `UPDATE promotions SET
        code=?, name=?, description=?, promo_type=?, discount_percent=?, discount_amount_cents=?,
        plan_id=?, duration_id=?, min_months=?, new_users_only=?, starts_at=?, ends_at=?,
        max_uses=?, enabled=?, updated_at=datetime('now')
       WHERE id=?`
    ).run(...fields, body.id);
    return db.prepare(`SELECT * FROM promotions WHERE id=?`).get(body.id);
  }
  const r = db
    .prepare(
      `INSERT INTO promotions (
        code, name, description, promo_type, discount_percent, discount_amount_cents,
        plan_id, duration_id, min_months, new_users_only, starts_at, ends_at, max_uses, enabled
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    )
    .run(...fields);
  return db.prepare(`SELECT * FROM promotions WHERE id=?`).get(r.lastInsertRowid);
}

function upsertRenewalRule(body) {
  const db = getDb();
  const enabled = body.enabled === false || body.enabled === 0 ? 0 : 1;
  if (body.id) {
    db.prepare(
      `UPDATE renewal_rules SET plan_id=?, duration_id=?, auto_renew_default=?, notice_days=?,
        terms_fr=?, enabled=?, updated_at=datetime('now') WHERE id=?`
    ).run(
      body.plan_id || null,
      body.duration_id || null,
      body.auto_renew_default ? 1 : 0,
      Number(body.notice_days) || 7,
      body.terms_fr || "",
      enabled,
      body.id
    );
    return db.prepare(`SELECT * FROM renewal_rules WHERE id=?`).get(body.id);
  }
  const r = db
    .prepare(
      `INSERT INTO renewal_rules (plan_id, duration_id, auto_renew_default, notice_days, terms_fr, enabled)
       VALUES (?,?,?,?,?,?)`
    )
    .run(
      body.plan_id || null,
      body.duration_id || null,
      body.auto_renew_default ? 1 : 0,
      Number(body.notice_days) || 7,
      body.terms_fr || "",
      enabled
    );
  return db.prepare(`SELECT * FROM renewal_rules WHERE id=?`).get(r.lastInsertRowid);
}

function setEnabled(table, id, enabled) {
  const allowed = {
    plans: true,
    durations: true,
    plan_tariffs: true,
    promotions: true,
    renewal_rules: true,
  };
  if (!allowed[table]) {
    const err = new Error("Table non autorisée.");
    err.status = 400;
    throw err;
  }
  const db = getDb();
  db.prepare(
    `UPDATE ${table} SET enabled=?, updated_at=datetime('now') WHERE id=?`
  ).run(enabled ? 1 : 0, id);
  return db.prepare(`SELECT * FROM ${table} WHERE id=?`).get(id);
}

function analytics() {
  const db = getDb();
  const revenue = db
    .prepare(
      `SELECT
         COALESCE(SUM(CASE WHEN status='succeeded' AND tx_type IN ('purchase','extension','plan_change') THEN amount_cents ELSE 0 END),0) AS revenue_cents,
         COALESCE(SUM(CASE WHEN status='succeeded' AND tx_type='purchase' THEN amount_cents ELSE 0 END),0) AS purchase_cents,
         COUNT(*) AS tx_count
       FROM transactions`
    )
    .get();

  const byDuration = db
    .prepare(
      `SELECT d.months, d.label,
              COUNT(s.id) AS subscriptions,
              COALESCE(SUM(CASE WHEN t.tx_type IN ('purchase','extension','plan_change') AND t.status='succeeded' THEN t.amount_cents ELSE 0 END),0) AS revenue_cents
       FROM durations d
       LEFT JOIN subscriptions s ON s.duration_id = d.id
       LEFT JOIN transactions t ON t.subscription_id = s.id
       GROUP BY d.id
       ORDER BY d.sort_order`
    )
    .all();

  const byPlan = db
    .prepare(
      `SELECT p.slug, p.name,
              COUNT(s.id) AS subscriptions,
              SUM(CASE WHEN s.status IN ('active','active_until_end') THEN 1 ELSE 0 END) AS active_count,
              SUM(CASE WHEN s.status='cancelled' OR s.cancelled_at IS NOT NULL THEN 1 ELSE 0 END) AS cancelled_count
       FROM plans p
       LEFT JOIN subscriptions s ON s.plan_id = p.id
       GROUP BY p.id
       ORDER BY p.sort_order`
    )
    .all();

  const statusCounts = db
    .prepare(
      `SELECT status, COUNT(*) AS c FROM subscriptions GROUP BY status`
    )
    .all();

  const recent = db
    .prepare(
      `SELECT s.id, u.email, p.name AS plan_name, d.label AS duration_label, s.status, s.auto_renew, s.created_at, s.cancelled_at
       FROM subscriptions s
       JOIN users u ON u.id = s.user_id
       JOIN plans p ON p.id = s.plan_id
       JOIN durations d ON d.id = s.duration_id
       ORDER BY s.created_at DESC LIMIT 50`
    )
    .all();

  return {
    generated_at: new Date().toISOString(),
    revenue,
    by_duration: byDuration,
    by_plan: byPlan,
    status_counts: statusCounts,
    recent_subscriptions: recent,
  };
}

function exportCsv() {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT s.id, u.email, p.slug AS plan, d.months, s.auto_renew, s.status,
              s.start_at, s.end_at, s.cancelled_at, s.created_at,
              COALESCE((
                SELECT SUM(amount_cents) FROM transactions t
                WHERE t.subscription_id = s.id AND t.status='succeeded'
              ),0) AS revenue_cents
       FROM subscriptions s
       JOIN users u ON u.id=s.user_id
       JOIN plans p ON p.id=s.plan_id
       JOIN durations d ON d.id=s.duration_id
       ORDER BY s.created_at DESC`
    )
    .all();

  const header = [
    "id",
    "email",
    "plan",
    "months",
    "auto_renew",
    "status",
    "start_at",
    "end_at",
    "cancelled_at",
    "created_at",
    "revenue_cents",
  ];
  const lines = [header.join(",")];
  for (const r of rows) {
    lines.push(
      header
        .map((k) => {
          const v = r[k] == null ? "" : String(r[k]);
          return `"${v.replace(/"/g, '""')}"`;
        })
        .join(",")
    );
  }
  return lines.join("\n");
}

module.exports = {
  listAllAdmin,
  upsertDuration,
  upsertTariff,
  upsertPromotion,
  upsertRenewalRule,
  setEnabled,
  analytics,
  exportCsv,
  touch,
};
