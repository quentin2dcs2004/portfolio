export type MembershipTier = "free" | "plus" | "premium" | "elite";

export type MeetoraProfile = {
  id: string;
  displayName: string;
  age: number;
  handle: string;
  bio: string;
  city: string;
  country: string;
  /** Distance label style Happn, e.g. "À 1,2 km" */
  distanceLabel: string;
  membership: MembershipTier;
  joinedAt: string;
  email: string;
  /** Full-bleed carousel photos (remote demo URLs) */
  photos: string[];
  interests: string[];
  stats: {
    connections: number;
    events: number;
    posts: number;
  };
};

/**
 * Profil démo Quentin, présenté comme une carte Happn
 * (photos stock — placeholders jusqu’aux vraies photos).
 */
export const DEMO_PROFILE: MeetoraProfile = {
  id: "usr_demo_quentin",
  displayName: "Quentin",
  age: 22,
  handle: "@quentin",
  bio: "Créateur de Meetora. Café, vernissages, et conversations qui durent plus longtemps qu’un match.",
  city: "Lyon",
  country: "France",
  distanceLabel: "Croisé à 800 m",
  membership: "premium",
  joinedAt: "2025-11-14T10:00:00.000Z",
  email: "quentin@meetora.app",
  photos: [
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&h=1200&fit=crop&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&h=1200&fit=crop&q=80",
    "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=900&h=1200&fit=crop&q=80",
  ],
  interests: ["Design", "Café", "Photo", "Startups", "Voyage", "Musique"],
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
