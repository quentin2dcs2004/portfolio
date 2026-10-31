const API = {
  async request(path, options = {}) {
    const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
    const res = await fetch(path, { ...options, headers });
    const isCsv = (res.headers.get("content-type") || "").includes("text/csv");
    if (isCsv) {
      if (!res.ok) throw new Error("Export impossible");
      return res.text();
    }
    const json = await res.json().catch(() => ({ ok: false, error: "Réponse invalide" }));
    if (!res.ok || json.ok === false) {
      throw new Error(json.error || `Erreur ${res.status}`);
    }
    return json.data;
  },
  catalog() {
    return this.request("/api/catalog");
  },
  quote(body) {
    return this.request("/api/quote", { method: "POST", body: JSON.stringify(body) });
  },
  subscribe(body) {
    return this.request("/api/subscribe", { method: "POST", body: JSON.stringify(body) });
  },
  mySubscriptions(email) {
    return this.request(`/api/me/subscriptions?email=${encodeURIComponent(email)}`);
  },
  cancel(id, immediate = false) {
    return this.request(`/api/subscriptions/${id}/cancel`, {
      method: "POST",
      body: JSON.stringify({ immediate }),
    });
  },
  extend(id, body) {
    return this.request(`/api/subscriptions/${id}/extend`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
  changePlan(id, body) {
    return this.request(`/api/subscriptions/${id}/change-plan`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
  admin(path, { method = "GET", body, token } = {}) {
    return this.request(path, {
      method,
      body: body ? JSON.stringify(body) : undefined,
      headers: { "x-admin-token": token },
    });
  },
};

function money(cents, currency = "EUR") {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
  }).format((cents || 0) / 100);
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(iso));
}

function toast(message, ms = 3200) {
  let el = document.querySelector(".toast");
  if (!el) {
    el = document.createElement("div");
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove("show"), ms);
}

window.API = API;
window.money = money;
window.formatDate = formatDate;
window.toast = toast;
