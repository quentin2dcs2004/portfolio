(() => {
  const params = new URLSearchParams(location.search);
  const emailInput = document.getElementById("email");
  const loadBtn = document.getElementById("load-btn");
  const subsEl = document.getElementById("subs");
  const txBody = document.querySelector("#tx-table tbody");
  let catalog = null;

  if (params.get("email")) emailInput.value = params.get("email");

  function statusLabel(s) {
    const map = {
      active: "Actif",
      active_until_end: "Actif jusqu’à la fin (auto-renouvellement coupé)",
      cancelled: "Résilié",
      expired: "Expiré",
    };
    return map[s] || s;
  }

  async function load() {
    const email = emailInput.value.trim();
    if (!email) return toast("E-mail requis");
    try {
      if (!catalog) catalog = await API.catalog();
      const data = await API.mySubscriptions(email);
      renderSubs(data.subscriptions);
      renderTx(data.transactions);
      history.replaceState({}, "", `?email=${encodeURIComponent(email)}`);
    } catch (e) {
      toast(e.message);
    }
  }

  function renderSubs(subs) {
    if (!subs.length) {
      subsEl.innerHTML = `<section class="panel"><p class="muted">Aucun abonnement pour cet e-mail.</p></section>`;
      return;
    }
    subsEl.innerHTML = subs
      .map((s) => {
        const badge = s.auto_renew
          ? `<span class="badge badge-renew">Renouvellement auto</span>`
          : `<span class="badge badge-fixed">Durée fixe</span>`;
        const durationOptions = (catalog?.durations || [])
          .filter((d) => d.enabled)
          .map((d) => `<option value="${d.months}">${d.label}</option>`)
          .join("");
        const planOptions = (catalog?.plans || [])
          .filter((p) => p.enabled)
          .map(
            (p) =>
              `<option value="${p.slug}" ${p.slug === s.plan.slug ? "selected" : ""}>${p.name}</option>`
          )
          .join("");
        return `
        <section class="panel" data-id="${s.id}">
          <div style="display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;align-items:start">
            <div>
              <h2 class="section-title" style="margin:0">${s.plan.name} · ${s.duration.label}</h2>
              <p class="muted" style="margin:0.35rem 0">${statusLabel(s.status)}</p>
              ${badge}
            </div>
            <div class="muted" style="text-align:right;font-size:0.9rem">
              <div>Début : ${formatDate(s.start_at)}</div>
              <div>Fin : ${formatDate(s.end_at)}</div>
            </div>
          </div>
          <p class="legal-note">${s.renewal_terms_fr}</p>
          <div class="form-row" style="margin-top:1rem">
            <div class="field"><label>Prolonger (mois)</label>
              <select class="extend-months">${durationOptions}</select></div>
            <div class="field" style="align-self:end">
              <button type="button" class="btn btn-ghost extend-btn">Prolonger</button>
            </div>
          </div>
          <div class="form-row">
            <div class="field"><label>Changer de formule</label>
              <select class="change-plan">${planOptions}</select></div>
            <div class="field"><label>Nouvelle durée</label>
              <select class="change-months">${durationOptions}</select></div>
            <div class="field"><label>Mode</label>
              <select class="change-model">
                <option value="fixed" ${!s.auto_renew ? "selected" : ""}>Durée fixe</option>
                <option value="renew" ${s.auto_renew ? "selected" : ""}>Renouvellement auto</option>
              </select></div>
            <div class="field" style="align-self:end">
              <button type="button" class="btn btn-ghost change-btn">Appliquer le changement</button>
            </div>
          </div>
          <div class="row-actions" style="margin-top:0.75rem">
            <button type="button" class="btn btn-danger cancel-btn">
              ${s.auto_renew ? "Arrêter le renouvellement" : "Résilier maintenant"}
            </button>
          </div>
        </section>`;
      })
      .join("");

    subsEl.querySelectorAll("section.panel").forEach((panel) => {
      const id = Number(panel.dataset.id);
      panel.querySelector(".extend-btn").addEventListener("click", async () => {
        try {
          const months = Number(panel.querySelector(".extend-months").value);
          await API.extend(id, { months });
          toast("Abonnement prolongé");
          load();
        } catch (e) {
          toast(e.message);
        }
      });
      panel.querySelector(".change-btn").addEventListener("click", async () => {
        try {
          await API.changePlan(id, {
            plan: panel.querySelector(".change-plan").value,
            months: Number(panel.querySelector(".change-months").value),
            auto_renew: panel.querySelector(".change-model").value === "renew",
          });
          toast("Formule mise à jour");
          load();
        } catch (e) {
          toast(e.message);
        }
      });
      panel.querySelector(".cancel-btn").addEventListener("click", async () => {
        try {
          const sub = (await API.mySubscriptions(emailInput.value.trim())).subscriptions.find(
            (x) => x.id === id
          );
          await API.cancel(id, !sub?.auto_renew);
          toast("Résiliation enregistrée");
          load();
        } catch (e) {
          toast(e.message);
        }
      });
    });
  }

  function renderTx(txs) {
    txBody.innerHTML = txs
      .map(
        (t) => `<tr>
        <td>${formatDate(t.created_at)}</td>
        <td>${t.tx_type}</td>
        <td>${money(t.amount_cents, t.currency)}</td>
        <td>${t.status}</td>
      </tr>`
      )
      .join("");
  }

  loadBtn.addEventListener("click", load);
  if (emailInput.value) load();
})();
