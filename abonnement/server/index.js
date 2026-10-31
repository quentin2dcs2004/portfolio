const path = require("path");
const express = require("express");
const cors = require("cors");
const { getDb } = require("./db");
const { seed } = require("./seed");
const { getCatalog, buildQuote } = require("./catalog");
const {
  createSubscription,
  cancelSubscription,
  extendSubscription,
  changePlan,
  listSubscriptions,
  getSubscriptionById,
  listTransactions,
} = require("./subscriptions");
const {
  listAllAdmin,
  upsertDuration,
  upsertTariff,
  upsertPromotion,
  upsertRenewalRule,
  setEnabled,
  analytics,
  exportCsv,
} = require("./admin");

const PORT = Number(process.env.PORT) || 3847;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "quentin-admin";

seed();

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "..", "public")));

function ok(res, data) {
  res.json({ ok: true, data });
}

function fail(res, err) {
  const status = err.status || 500;
  res.status(status).json({ ok: false, error: err.message || "Erreur serveur" });
}

function requireAdmin(req, res, next) {
  const token = req.headers["x-admin-token"] || req.query.admin_token;
  if (token !== ADMIN_TOKEN) {
    return res.status(401).json({ ok: false, error: "Admin non autorisé." });
  }
  next();
}

/* ---------- Public catalog & quote ---------- */

app.get("/api/health", (_req, res) => {
  getDb();
  ok(res, { status: "up", service: "abonnement" });
});

app.get("/api/catalog", (_req, res) => {
  try {
    ok(res, getCatalog());
  } catch (e) {
    fail(res, e);
  }
});

app.post("/api/quote", (req, res) => {
  try {
    const { plan, months, auto_renew, promo_code, email } = req.body || {};
    const quote = buildQuote({
      planSlug: plan,
      months: Number(months),
      autoRenew: !!auto_renew,
      promoCode: promo_code,
      email,
    });
    ok(res, quote);
  } catch (e) {
    fail(res, e);
  }
});

app.post("/api/subscribe", (req, res) => {
  try {
    const body = req.body || {};
    if (!body.email || !body.plan || !body.months) {
      const err = new Error("email, plan et months sont requis.");
      err.status = 400;
      throw err;
    }
    if (body.auto_renew == null) {
      const err = new Error("Choisissez renouvellement automatique ou durée fixe (auto_renew).");
      err.status = 400;
      throw err;
    }
    const result = createSubscription({
      email: body.email,
      displayName: body.display_name || "",
      planSlug: body.plan,
      months: Number(body.months),
      autoRenew: !!body.auto_renew,
      promoCode: body.promo_code,
    });
    ok(res, result);
  } catch (e) {
    fail(res, e);
  }
});

app.get("/api/me/subscriptions", (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      const err = new Error("email requis.");
      err.status = 400;
      throw err;
    }
    ok(res, {
      subscriptions: listSubscriptions({ email }),
      transactions: listTransactions({ email }),
    });
  } catch (e) {
    fail(res, e);
  }
});

app.post("/api/subscriptions/:id/cancel", (req, res) => {
  try {
    ok(res, cancelSubscription(Number(req.params.id), { immediate: !!req.body?.immediate }));
  } catch (e) {
    fail(res, e);
  }
});

app.post("/api/subscriptions/:id/extend", (req, res) => {
  try {
    ok(
      res,
      extendSubscription(Number(req.params.id), {
        months: req.body?.months,
        promoCode: req.body?.promo_code,
      })
    );
  } catch (e) {
    fail(res, e);
  }
});

app.post("/api/subscriptions/:id/change-plan", (req, res) => {
  try {
    const body = req.body || {};
    ok(
      res,
      changePlan(Number(req.params.id), {
        planSlug: body.plan,
        months: body.months,
        autoRenew: body.auto_renew,
        promoCode: body.promo_code,
      })
    );
  } catch (e) {
    fail(res, e);
  }
});

app.get("/api/subscriptions/:id", (req, res) => {
  try {
    const sub = getSubscriptionById(Number(req.params.id));
    if (!sub) {
      const err = new Error("Introuvable.");
      err.status = 404;
      throw err;
    }
    ok(res, {
      subscription: sub,
      transactions: listTransactions({ subscriptionId: sub.id }),
    });
  } catch (e) {
    fail(res, e);
  }
});

/* ---------- Admin ---------- */

app.get("/api/admin/bootstrap", requireAdmin, (_req, res) => {
  try {
    ok(res, listAllAdmin());
  } catch (e) {
    fail(res, e);
  }
});

app.post("/api/admin/durations", requireAdmin, (req, res) => {
  try {
    ok(res, upsertDuration(req.body || {}));
  } catch (e) {
    fail(res, e);
  }
});

app.post("/api/admin/tariffs", requireAdmin, (req, res) => {
  try {
    ok(res, upsertTariff(req.body || {}));
  } catch (e) {
    fail(res, e);
  }
});

app.post("/api/admin/promotions", requireAdmin, (req, res) => {
  try {
    ok(res, upsertPromotion(req.body || {}));
  } catch (e) {
    fail(res, e);
  }
});

app.post("/api/admin/renewal-rules", requireAdmin, (req, res) => {
  try {
    ok(res, upsertRenewalRule(req.body || {}));
  } catch (e) {
    fail(res, e);
  }
});

app.post("/api/admin/:table/:id/enabled", requireAdmin, (req, res) => {
  try {
    ok(res, setEnabled(req.params.table, Number(req.params.id), !!req.body?.enabled));
  } catch (e) {
    fail(res, e);
  }
});

app.get("/api/admin/analytics", requireAdmin, (_req, res) => {
  try {
    ok(res, analytics());
  } catch (e) {
    fail(res, e);
  }
});

app.get("/api/admin/export.csv", requireAdmin, (_req, res) => {
  try {
    const csv = exportCsv();
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="subscriptions-export.csv"');
    res.send(csv);
  } catch (e) {
    fail(res, e);
  }
});

app.get("/api/admin/subscriptions", requireAdmin, (req, res) => {
  try {
    ok(res, listSubscriptions({ status: req.query.status }));
  } catch (e) {
    fail(res, e);
  }
});

/* SPA-ish fallbacks */
app.get(["/souscrire", "/subscribe"], (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});
app.get(["/compte", "/account"], (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "compte.html"));
});
app.get(["/admin", "/back-office"], (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "admin.html"));
});

app.listen(PORT, () => {
  console.log(`Abonnement API + UI on http://localhost:${PORT}`);
  console.log(`Admin token: ${ADMIN_TOKEN}`);
});
