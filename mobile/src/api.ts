import { API_URL } from "./config";
import type { Catalog, Quote, Subscription, Transaction } from "./types";

type ApiEnvelope<T> = { ok: boolean; data?: T; error?: string };

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options.headers || {}),
    },
  });
  const json = (await res.json()) as ApiEnvelope<T>;
  if (!res.ok || !json.ok) {
    throw new Error(json.error || `Erreur ${res.status}`);
  }
  return json.data as T;
}

export const api = {
  health: () => request<{ status: string }>("/api/health"),
  catalog: () => request<Catalog>("/api/catalog"),
  quote: (body: {
    plan: string;
    months: number;
    auto_renew: boolean;
    promo_code?: string;
    email?: string;
  }) => request<Quote>("/api/quote", { method: "POST", body: JSON.stringify(body) }),
  subscribe: (body: {
    email: string;
    plan: string;
    months: number;
    auto_renew: boolean;
    promo_code?: string;
    display_name?: string;
  }) =>
    request<{ subscription: Subscription; quote: Quote }>("/api/subscribe", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  mySubscriptions: (email: string) =>
    request<{ subscriptions: Subscription[]; transactions: Transaction[] }>(
      `/api/me/subscriptions?email=${encodeURIComponent(email)}`
    ),
  cancel: (id: number, immediate = false) =>
    request<Subscription>(`/api/subscriptions/${id}/cancel`, {
      method: "POST",
      body: JSON.stringify({ immediate }),
    }),
  extend: (id: number, months: number) =>
    request<{ subscription: Subscription }>(`/api/subscriptions/${id}/extend`, {
      method: "POST",
      body: JSON.stringify({ months }),
    }),
  changePlan: (
    id: number,
    body: { plan: string; months: number; auto_renew: boolean }
  ) =>
    request<{ subscription: Subscription }>(`/api/subscriptions/${id}/change-plan`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
};
