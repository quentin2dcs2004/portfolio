export type MembershipTier = "free" | "plus" | "premium" | "elite";

export type MeetoraProfile = {
  id: string;
  displayName: string;
  handle: string;
  bio: string;
  city: string;
  country: string;
  membership: MembershipTier;
  joinedAt: string; // ISO date
  email: string;
  stats: {
    connections: number;
    events: number;
    posts: number;
  };
};

/** Profil démo pour critique visuelle immédiate (Meetora). */
export const DEMO_PROFILE: MeetoraProfile = {
  id: "usr_demo_quentin",
  displayName: "Quentin Da Costa",
  handle: "@quentin",
  bio:
    "Créateur de Meetora. J’aime les produits simples, les rencontres vraies et les abonnements qui respectent le budget de chacun.",
  city: "Lyon",
  country: "France",
  membership: "premium",
  joinedAt: "2025-11-14T10:00:00.000Z",
  email: "quentin@meetora.app",
  stats: {
    connections: 128,
    events: 14,
    posts: 36,
  },
};

export const MEMBERSHIP_LABELS: Record<MembershipTier, string> = {
  free: "Gratuit",
  plus: "Plus",
  premium: "Premium",
  elite: "Elite",
};
