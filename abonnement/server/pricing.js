function parseJson(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function formatMoney(cents, currency = "EUR", locale = "fr-FR") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format((cents || 0) / 100);
}

function addMonths(isoDate, months) {
  const d = new Date(isoDate);
  const day = d.getUTCDate();
  d.setUTCMonth(d.getUTCMonth() + months);
  if (d.getUTCDate() < day) d.setUTCDate(0);
  return d.toISOString();
}

function isPromoActive(promo, now = new Date()) {
  if (!promo || !promo.enabled) return false;
  if (promo.starts_at && new Date(promo.starts_at) > now) return false;
  if (promo.ends_at && new Date(promo.ends_at) < now) return false;
  if (promo.max_uses != null && promo.used_count >= promo.max_uses) return false;
  return true;
}

function promoApplies(promo, { planId, durationMonths, isNewUser }) {
  if (!isPromoActive(promo)) return false;
  if (promo.plan_id && promo.plan_id !== planId) return false;
  if (promo.duration_id && promo._duration_months && promo._duration_months !== durationMonths) {
    return false;
  }
  if (promo.min_months != null && durationMonths < promo.min_months) return false;
  if (promo.new_users_only && !isNewUser) return false;
  return true;
}

function applyPromo(totalCents, promo) {
  if (!promo) return { totalCents, promoDiscountCents: 0 };
  let discount = 0;
  if (promo.discount_percent) {
    discount += Math.round(totalCents * (promo.discount_percent / 100));
  }
  if (promo.discount_amount_cents) {
    discount += promo.discount_amount_cents;
  }
  discount = Math.min(discount, totalCents);
  return { totalCents: totalCents - discount, promoDiscountCents: discount };
}

function quoteTariff(tariff, promo) {
  const listMonthly = Math.round(
    tariff.total_price_cents / (1 - (tariff.discount_percent || 0) / 100) / tariff.months
  );
  const { totalCents, promoDiscountCents } = applyPromo(tariff.total_price_cents, promo);
  const monthlyEq = Math.round(totalCents / tariff.months);
  const savingsVsMonthly =
    listMonthly * tariff.months - totalCents;
  return {
    total_price_cents: totalCents,
    currency: tariff.currency,
    monthly_equivalent_cents: monthlyEq,
    duration_discount_percent: tariff.discount_percent,
    promo_discount_cents: promoDiscountCents,
    savings_cents: Math.max(0, savingsVsMonthly),
    savings_percent:
      listMonthly * tariff.months > 0
        ? Math.round((Math.max(0, savingsVsMonthly) / (listMonthly * tariff.months)) * 1000) / 10
        : 0,
  };
}

module.exports = {
  parseJson,
  formatMoney,
  addMonths,
  isPromoActive,
  promoApplies,
  applyPromo,
  quoteTariff,
};
