(() => {
  const tokenInput = document.getElementById("token");
  const bootBtn = document.getElementById("boot-btn");
  let bootstrap = null;
  let analyticsData = null;

  const panels = {
    analytics: document.getElementById("panel-analytics"),
    durations: document.getElementById("panel-durations"),
    tariffs: document.getElementById("panel-tariffs"),
    promos: document.getElementById("panel-promos"),
    subs: document.getElementById("panel-subs"),
  };

  function token() {
    return tokenInput.value.trim();
  }

  async function admin(path, opts = {}) {
    return API.admin(path, { ...opts, token: token() });
  }

  document.querySelectorAll("#tabs .chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const tab = chip.dataset.tab;
      document.querySelectorAll("#tabs .chip").forEach((c) => {
        c.setAttribute("aria-pressed", String(c === chip));
      });
      Object.entries(panels).forEach(([k, el]) => {
        el.classList.toggle("hidden", k !== tab);
      });
    });
  });

  function renderAnalytics() {
    const a = analyticsData;
    if (!a) return;
    panels.analytics.innerHTML = `
      <section class="panel">
        <div class="stats">
          <div class="stat"><div class="label">Revenu total</div><div class="value">${money(
            a.revenue.revenue_cents
          )}</div></div>
          <div class="stat"><div class="label">Achats</div><div class="value">${money(
            a.revenue.purchase_cents
          )}</div></div>
          <div class="stat"><div class="label">Transactions</div><div class="value">${
            a.revenue.tx_count
          }</div></div>
        </div>
        <div class="row-actions" style="margin-bottom:1rem">
          <button type="button" class="btn btn-ghost" id="export-btn">Exporter CSV</button>
          <button type="button" class="btn btn-ghost" id="refresh-analytics">Rafraîchir</button>
        </div>
        <h3 class="section-title">Performance par durée</h3>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Durée</th><th>Souscriptions</th><th>Revenu</th></tr></thead>
          <tbody>
            ${a.by_duration
              .map(
                (r) =>
                  `<tr><td>${r.label}</td><td>${r.subscriptions}</td><td>${money(
                    r.revenue_cents
                  )}</td></tr>`
              )
              .join("")}
          </tbody>
        </table></div>
        <h3 class="section-title" style="margin-top:1rem">Par formule</h3>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Formule</th><th>Total</th><th>Actifs</th><th>Résiliations</th></tr></thead>
          <tbody>
            ${a.by_plan
              .map(
                (r) =>
                  `<tr><td>${r.name}</td><td>${r.subscriptions}</td><td>${r.active_count}</td><td>${r.cancelled_count}</td></tr>`
              )
              .join("")}
          </tbody>
        </table></div>
      </section>`;
    document.getElementById("export-btn").onclick = async () => {
      try {
        const csv = await fetch("/api/admin/export.csv", {
          headers: { "x-admin-token": token() },
        }).then(async (r) => {
          if (!r.ok) throw new Error("Export refusé");
          return r.text();
        });
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const aEl = document.createElement("a");
        aEl.href = url;
        aEl.download = "subscriptions-export.csv";
        aEl.click();
        URL.revokeObjectURL(url);
      } catch (e) {
        toast(e.message);
      }
    };
    document.getElementById("refresh-analytics").onclick = async () => {
      analyticsData = await admin("/api/admin/analytics");
      renderAnalytics();
    };
  }

  function renderDurations() {
    panels.durations.innerHTML = `
      <section class="panel">
        <h2 class="section-title">Durées</h2>
        <p class="section-sub">Ajouter, activer ou désactiver des durées (ex. 1, 3, 6, 12, 24 mois).</p>
        <div class="form-row">
          <div class="field"><label>Mois</label><input id="d-months" type="number" min="1" value="18" /></div>
          <div class="field"><label>Libellé</label><input id="d-label" type="text" placeholder="18 mois" /></div>
          <div class="field" style="align-self:end"><button type="button" class="btn btn-primary" id="d-save" style="width:auto">Enregistrer</button></div>
        </div>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Mois</th><th>Libellé</th><th>Actif</th><th></th></tr></thead>
          <tbody>
            ${bootstrap.durations
              .map(
                (d) => `<tr>
              <td>${d.months}</td><td>${d.label}</td><td>${d.enabled ? "Oui" : "Non"}</td>
              <td class="row-actions">
                <button type="button" class="btn btn-ghost" data-toggle-duration="${d.id}" data-enabled="${
                  d.enabled ? 0 : 1
                }">${d.enabled ? "Désactiver" : "Activer"}</button>
              </td></tr>`
              )
              .join("")}
          </tbody>
        </table></div>
      </section>`;
    document.getElementById("d-save").onclick = async () => {
      try {
        const months = Number(document.getElementById("d-months").value);
        const label = document.getElementById("d-label").value || `${months} mois`;
        await admin("/api/admin/durations", {
          method: "POST",
          body: { months, label, enabled: true },
        });
        toast("Durée enregistrée");
        await reload();
      } catch (e) {
        toast(e.message);
      }
    };
    panels.durations.querySelectorAll("[data-toggle-duration]").forEach((btn) => {
      btn.onclick = async () => {
        try {
          await admin(`/api/admin/durations/${btn.dataset.toggleDuration}/enabled`, {
            method: "POST",
            body: { enabled: btn.dataset.enabled === "1" },
          });
          await reload();
        } catch (e) {
          toast(e.message);
        }
      };
    });
  }

  function renderTariffs() {
    panels.tariffs.innerHTML = `
      <section class="panel">
        <h2 class="section-title">Tarifs par formule / durée</h2>
        <p class="section-sub">Prix total, devise, équivalent mensuel, % de réduction — jamais hardcodés côté app.</p>
        <div class="form-row">
          <div class="field"><label>Formule</label>
            <select id="t-plan">${bootstrap.plans
              .map((p) => `<option value="${p.id}">${p.name}</option>`)
              .join("")}</select></div>
          <div class="field"><label>Durée</label>
            <select id="t-duration">${bootstrap.durations
              .map((d) => `<option value="${d.id}">${d.label}</option>`)
              .join("")}</select></div>
          <div class="field"><label>Prix total (centimes)</label><input id="t-total" type="number" value="999" /></div>
          <div class="field"><label>Devise</label><input id="t-currency" value="EUR" /></div>
          <div class="field"><label>Réduction %</label><input id="t-discount" type="number" value="0" /></div>
          <div class="field" style="align-self:end"><button type="button" class="btn btn-primary" id="t-save" style="width:auto">Enregistrer tarif</button></div>
        </div>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Formule</th><th>Durée</th><th>Total</th><th>/mois</th><th>Remise</th><th>Actif</th><th></th></tr></thead>
          <tbody>
            ${bootstrap.tariffs
              .map(
                (t) => `<tr>
              <td>${t.plan_name}</td><td>${t.duration_label}</td>
              <td>${money(t.total_price_cents, t.currency)}</td>
              <td>${money(t.monthly_equivalent_cents, t.currency)}</td>
              <td>${t.discount_percent}%</td><td>${t.enabled ? "Oui" : "Non"}</td>
              <td><button type="button" class="btn btn-ghost" data-toggle-tariff="${t.id}" data-enabled="${
                  t.enabled ? 0 : 1
                }">${t.enabled ? "Off" : "On"}</button></td>
            </tr>`
              )
              .join("")}
          </tbody>
        </table></div>
      </section>`;
    document.getElementById("t-save").onclick = async () => {
      try {
        const total = Number(document.getElementById("t-total").value);
        const durationId = Number(document.getElementById("t-duration").value);
        const duration = bootstrap.durations.find((d) => d.id === durationId);
        await admin("/api/admin/tariffs", {
          method: "POST",
          body: {
            plan_id: Number(document.getElementById("t-plan").value),
            duration_id: durationId,
            total_price_cents: total,
            currency: document.getElementById("t-currency").value || "EUR",
            monthly_equivalent_cents: Math.round(total / (duration?.months || 1)),
            discount_percent: Number(document.getElementById("t-discount").value) || 0,
            enabled: true,
          },
        });
        toast("Tarif enregistré");
        await reload();
      } catch (e) {
        toast(e.message);
      }
    };
    panels.tariffs.querySelectorAll("[data-toggle-tariff]").forEach((btn) => {
      btn.onclick = async () => {
        await admin(`/api/admin/plan_tariffs/${btn.dataset.toggleTariff}/enabled`, {
          method: "POST",
          body: { enabled: btn.dataset.enabled === "1" },
        });
        await reload();
      };
    });
  }

  function renderPromos() {
    panels.promos.innerHTML = `
      <section class="panel">
        <h2 class="section-title">Promotions</h2>
        <p class="section-sub">Nouveaux utilisateurs, temporaires, longues périodes, codes, lancement / événement.</p>
        <div class="form-row">
          <div class="field"><label>Nom</label><input id="p-name" placeholder="Promo printemps" /></div>
          <div class="field"><label>Code</label><input id="p-code" placeholder="PRINTEMPS15" /></div>
          <div class="field"><label>Type</label>
            <select id="p-type">
              <option value="new_user">new_user</option>
              <option value="temporary">temporary</option>
              <option value="long_period">long_period</option>
              <option value="promo_code">promo_code</option>
              <option value="launch">launch</option>
              <option value="special">special</option>
              <option value="event">event</option>
            </select></div>
          <div class="field"><label>Remise %</label><input id="p-discount" type="number" value="15" /></div>
          <div class="field"><label>Min mois</label><input id="p-min" type="number" placeholder="optionnel" /></div>
          <div class="field"><label>Nouveaux only</label>
            <select id="p-new"><option value="0">Non</option><option value="1">Oui</option></select></div>
          <div class="field"><label>Début ISO</label><input id="p-start" placeholder="2026-01-01T00:00:00Z" /></div>
          <div class="field"><label>Fin ISO</label><input id="p-end" placeholder="2026-12-31T23:59:59Z" /></div>
          <div class="field" style="align-self:end"><button type="button" class="btn btn-primary" id="p-save" style="width:auto">Programmer</button></div>
        </div>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Nom</th><th>Code</th><th>Type</th><th>%</th><th>Actif</th><th></th></tr></thead>
          <tbody>
            ${bootstrap.promotions
              .map(
                (p) => `<tr>
              <td>${p.name}</td><td>${p.code || "—"}</td><td>${p.promo_type}</td>
              <td>${p.discount_percent ?? "—"}</td><td>${p.enabled ? "Oui" : "Non"}</td>
              <td><button type="button" class="btn btn-ghost" data-toggle-promo="${p.id}" data-enabled="${
                  p.enabled ? 0 : 1
                }">${p.enabled ? "Off" : "On"}</button></td>
            </tr>`
              )
              .join("")}
          </tbody>
        </table></div>
      </section>`;
    document.getElementById("p-save").onclick = async () => {
      try {
        await admin("/api/admin/promotions", {
          method: "POST",
          body: {
            name: document.getElementById("p-name").value,
            code: document.getElementById("p-code").value || null,
            promo_type: document.getElementById("p-type").value,
            discount_percent: Number(document.getElementById("p-discount").value) || 0,
            min_months: document.getElementById("p-min").value
              ? Number(document.getElementById("p-min").value)
              : null,
            new_users_only: document.getElementById("p-new").value === "1",
            starts_at: document.getElementById("p-start").value || null,
            ends_at: document.getElementById("p-end").value || null,
            enabled: true,
          },
        });
        toast("Promotion enregistrée");
        await reload();
      } catch (e) {
        toast(e.message);
      }
    };
    panels.promos.querySelectorAll("[data-toggle-promo]").forEach((btn) => {
      btn.onclick = async () => {
        await admin(`/api/admin/promotions/${btn.dataset.togglePromo}/enabled`, {
          method: "POST",
          body: { enabled: btn.dataset.enabled === "1" },
        });
        await reload();
      };
    });
  }

  function renderSubs(list) {
    panels.subs.innerHTML = `
      <section class="panel">
        <h2 class="section-title">Souscriptions & résiliations</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>ID</th><th>Email</th><th>Formule</th><th>Durée</th><th>Mode</th><th>Statut</th><th>Fin</th></tr></thead>
          <tbody>
            ${list
              .map(
                (s) => `<tr>
              <td>${s.id}</td><td>${s.email}</td><td>${s.plan.name}</td><td>${s.duration.label}</td>
              <td>${s.auto_renew ? "Auto" : "Fixe"}</td><td>${s.status}</td><td>${formatDate(
                  s.end_at
                )}</td>
            </tr>`
              )
              .join("")}
          </tbody>
        </table></div>
      </section>`;
  }

  async function reload() {
    bootstrap = await admin("/api/admin/bootstrap");
    analyticsData = await admin("/api/admin/analytics");
    const subs = await admin("/api/admin/subscriptions");
    renderAnalytics();
    renderDurations();
    renderTariffs();
    renderPromos();
    renderSubs(subs);
  }

  bootBtn.onclick = async () => {
    try {
      await reload();
      toast("Back-office chargé");
    } catch (e) {
      toast(e.message);
    }
  };
})();
