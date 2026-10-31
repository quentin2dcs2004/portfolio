import { FEED_PROFILES } from "./feedProfiles";
import type { MeetoraProfile } from "./demoProfile";

export type CrossedPin = MeetoraProfile & {
  lat: number;
  lng: number;
  crossedAt: string;
};

/** Pins autour de Lyon Presqu’île / Bellecour — démo chemins croisés. */
export const CROSSED_PINS: CrossedPin[] = [
  { ...FEED_PROFILES[0], lat: 45.7578, lng: 4.832, crossedAt: "Il y a 12 min" },
  { ...FEED_PROFILES[1], lat: 45.7685, lng: 4.8345, crossedAt: "Il y a 1 h" },
  { ...FEED_PROFILES[2], lat: 45.7622, lng: 4.8275, crossedAt: "Il y a 3 h" },
  { ...FEED_PROFILES[3], lat: 45.75, lng: 4.84, crossedAt: "Hier" },
  { ...FEED_PROFILES[4], lat: 45.766, lng: 4.8418, crossedAt: "Hier" },
];

export const LYON_CENTER = { lat: 45.7578, lng: 4.8357 };
