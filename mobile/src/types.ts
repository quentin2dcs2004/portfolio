export type Plan = {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  features: string[];
  sort_order: number;
  enabled: boolean;
};

export type Duration = {
  id: number;
  months: number;
  label: string;
  sort_order: number;
  enabled: boolean;
};

export type Tariff = {
  id: number;
  plan_id: number;
  duration_id: number;
  months: number;
  duration_label: string;
  plan_slug: string;
  plan_name: string;
  total_price_cents: number;
  currency: string;
  monthly_equivalent_cents: number;
  discount_percent: number;
  auto_renew_allowed: boolean;
  fixed_term_allowed: boolean;
  enabled: boolean;
};

export type Promotion = {
  id: number;
  code: string | null;
  name: string;
  description: string;
  promo_type: string;
  discount_percent: number | null;
  discount_amount_cents: number | null;
  new_users_only: boolean;
  enabled: boolean;
};

export type Catalog = {
  plans: Plan[];
  durations: Duration[];
  tariffs: Tariff[];
  promotions: Promotion[];
  feature_matrix: {
    features: string[];
    rows: { feature: string; plans: Record<string, boolean> }[];
  };
  renewal_rules: unknown[];
};

export type Quote = {
  plan: { id: number; slug: string; name: string };
  duration: { id: number; months: number; label: string };
  tariff_id: number;
  auto_renew: boolean;
  commitment_model: "auto_renew" | "fixed_term";
  pricing: {
    total_price_cents: number;
    currency: string;
    monthly_equivalent_cents: number;
    duration_discount_percent: number;
    promo_discount_cents: number;
    savings_cents: number;
    savings_percent: number;
  };
  promo: {
    id: number;
    code: string | null;
    name: string;
    description: string;
    promo_type: string;
  } | null;
  start_at: string;
  end_at: string;
  renewal_at: string | null;
  renewal_terms_fr: string;
};

export type Subscription = {
  id: number;
  email: string;
  plan: { id: number; slug: string; name: string };
  duration: { id: number; months: number; label: string };
  auto_renew: boolean;
  commitment_model: "auto_renew" | "fixed_term";
  start_at: string;
  end_at: string;
  status: string;
  renewal_terms_fr: string;
  cancelled_at: string | null;
};

export type Transaction = {
  id: number;
  subscription_id: number;
  tx_type: string;
  amount_cents: number;
  currency: string;
  status: string;
  created_at: string;
};
