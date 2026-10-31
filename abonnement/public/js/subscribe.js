(() => {
  const state = {
    catalog: null,
    planSlug: null,
    months: null,
    autoRenew: false,
    quote: null,
  };

  const els = {
    plans: document.getElementById("plans"),
    durations: document.getElementById("durations"),
    email: document.getElementById("email"),
    promo: document.getElementById("promo"),
    priceTotal: document.getElementById("price-total"),
    priceMonthly: document.getElementById("price-monthly"),
    savings: document.getElementById("savings"),
    endAt: document.getElementById("end-at"),
    renewalAt: document.getElementById("renewal-at"),
    durationDiscount: document.getElementById("duration-discount"),
    renewalTerms: document.getElementById("renewal-terms"),
    summaryPlan: document.getElementById("summary-plan"),
    badge: document.getElementById("commitment-badge"),
    subscribeBtn: document.getElementById("subscribe-btn"),
    activePromos: document.getElementById("active-promos"),
    compareHead: document.querySelector("#compare-table thead"),
    compareBody: document.querySelector("#compare-table tbody"),
  };

  function tariffsForPlan(slug) {
    return state.catalog.tariffs.filter((t) => t.plan_slug === slug && t.enabled);
  }

  function renderPlans() {
    els.plans.innerHTML = state.catalog.plans
      .map(
        (p) => `
      <article class="plan" role="button" tabindex="0" data-slug="${p.slug}" aria-pressed="${
          state.planSlug === p.slug
        }">
        <h3>${p.name}</h3>
        <p class="tagline">${p.tagline}</p>
        <ul>${p.features
          .slice(0, 4)
          .map((f) => `<li>${f}</li>`)
          .join("")}</ul>
      </article>`
      )
      .join("");

    els.plans.querySelectorAll(".plan").forEach((el) => {
      const pick = () => {
        state.planSlug = el.dataset.slug;
        const available = tariffsForPlan(state.planSlug);
        if (!available.find((t) => t.months === state.months)) {
          state.months = available[0]?.months || null;
        }
        renderPlans();
        renderDurations();
        refreshQuote();
      };
      el.addEventListener("click", pick);
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          pick();
        }
      });
    });
  }

  function renderDurations() {
    const available = tariffsForPlan(state.planSlug);
    els.durations.innerHTML = available
      .map(
        (t) => `
      <button type="button" class="chip" data-months="${t.months}" aria-pressed="${
          state.months === t.months
        }">${t.duration_label}</button>`
      )
      .join("");
    els.durations.querySelectorAll(".chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.months = Number(btn.dataset.months);
        renderDurations();
        refreshQuote();
      });
    });
  }

  function renderCompare() {
    const plans = state.catalog.plans;
    els.compareHead.innerHTML = `<tr><th>Fonctionnalité</th>${plans
      .map((p) => `<th>${p.name}</th>`)
      .join("")}</tr>`;
    els.compareBody.innerHTML = state.catalog.feature_matrix.rows
      .map((row) => {
        return `<tr><td>${row.feature}</td>${plans
          .map((p) => {
            const yes = row.plans[p.slug];
            return `<td class="${yes ? "yes" : "no"}">${yes ? "Oui" : "—"}</td>`;
          })
          .join("")}</tr>`;
      })
      .join("");
  }

  function renderPromos() {
    const list = state.catalog.promotions || [];
    if (!list.length) {
      els.activePromos.textContent = "";
      return;
    }
    els.activePromos.innerHTML =
      "<strong>Offres en cours :</strong> " +
      list
        .map((p) => {
          const code = p.code ? ` (code ${p.code})` : " (appliquée automatiquement si éligible)";
          return `${p.name}${code}`;
        })
        .join(" · ");
  }

  function renderSummary(quote) {
    if (!quote) {
      els.priceTotal.textContent = "—";
      return;
    }
    state.quote = quote;
    const p = quote.pricing;
    els.summaryPlan.textContent = `${quote.plan.name} · ${quote.duration.label}`;
    els.priceTotal.textContent = money(p.total_price_cents, p.currency);
    els.priceMonthly.textContent = `soit ${money(p.monthly_equivalent_cents, p.currency)} / mois en moyenne`;
    if (p.savings_cents > 0) {
      els.savings.hidden = false;
      els.savings.textContent = `Vous économisez ${money(p.savings_cents, p.currency)} (${p.savings_percent} %)`;
    } else {
      els.savings.hidden = true;
    }
    els.endAt.textContent = formatDate(quote.end_at);
    els.renewalAt.textContent = quote.auto_renew
      ? formatDate(quote.renewal_at)
      : "Aucun — durée fixe";
    els.durationDiscount.textContent = `${p.duration_discount_percent || 0} %`;
    els.renewalTerms.textContent = quote.renewal_terms_fr;
    els.badge.innerHTML = quote.auto_renew
      ? `<span class="badge badge-renew">Renouvellement automatique</span>`
      : `<span class="badge badge-fixed">Durée fixe · sans auto-renouvellement</span>`;
  }

  let quoteTimer;
  async function refreshQuote() {
    if (!state.planSlug || !state.months) return;
    clearTimeout(quoteTimer);
    quoteTimer = setTimeout(async () => {
      try {
        const quote = await API.quote({
          plan: state.planSlug,
          months: state.months,
          auto_renew: state.autoRenew,
          promo_code: els.promo.value.trim() || undefined,
          email: els.email.value.trim() || undefined,
        });
        renderSummary(quote);
      } catch (e) {
        toast(e.message);
      }
    }, 180);
  }

  document.querySelectorAll(".model").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.autoRenew = btn.dataset.model === "auto_renew";
      document.querySelectorAll(".model").forEach((b) => {
        b.setAttribute("aria-pressed", String(b === btn));
      });
      refreshQuote();
    });
  });

  els.email.addEventListener("change", refreshQuote);
  els.promo.addEventListener("change", refreshQuote);
  els.promo.addEventListener("keydown", (e) => {
    if (e.key === "Enter") refreshQuote();
  });

  els.subscribeBtn.addEventListener("click", async () => {
    try {
      if (!els.email.value.trim()) {
        toast("Indiquez votre e-mail.");
        return;
      }
      els.subscribeBtn.disabled = true;
      const result = await API.subscribe({
        email: els.email.value.trim(),
        plan: state.planSlug,
        months: state.months,
        auto_renew: state.autoRenew,
        promo_code: els.promo.value.trim() || undefined,
      });
      toast(`Abonnement ${result.subscription.plan.name} activé.`);
      setTimeout(() => {
        location.href = `/compte.html?email=${encodeURIComponent(els.email.value.trim())}`;
      }, 700);
    } catch (e) {
      toast(e.message);
    } finally {
      els.subscribeBtn.disabled = false;
    }
  });

  async function init() {
    try {
      state.catalog = await API.catalog();
      state.planSlug = state.catalog.plans.find((p) => p.slug === "premium")?.slug || state.catalog.plans[0]?.slug;
      const tariffs = tariffsForPlan(state.planSlug);
      state.months = tariffs.find((t) => t.months === 3)?.months || tariffs[0]?.months;
      renderPlans();
      renderDurations();
      renderCompare();
      renderPromos();
      refreshQuote();
    } catch (e) {
      toast(e.message);
    }
  }

  init();
})();
