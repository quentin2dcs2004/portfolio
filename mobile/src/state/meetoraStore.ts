import AsyncStorage from "@react-native-async-storage/async-storage";

const POINTS_KEY = "meetora.points";
const BOOST_KEY = "meetora.boostUntil";
const FORM_KEY = "meetora.seasonalMonth";
const CRUSH_CREDITS_KEY = "meetora.crushCredits";

export async function getPoints(): Promise<number> {
  const v = await AsyncStorage.getItem(POINTS_KEY);
  return v ? Number(v) || 0 : 0;
}

export async function addPoints(n: number): Promise<number> {
  const cur = await getPoints();
  const next = cur + n;
  await AsyncStorage.setItem(POINTS_KEY, String(next));
  return next;
}

export async function getBoostUntil(): Promise<string | null> {
  return AsyncStorage.getItem(BOOST_KEY);
}

export async function grantBoostHours(hours: number): Promise<string> {
  const until = new Date(Date.now() + hours * 3600e3).toISOString();
  await AsyncStorage.setItem(BOOST_KEY, until);
  return until;
}

export async function getSeasonalAnsweredMonth(): Promise<number | null> {
  const v = await AsyncStorage.getItem(FORM_KEY);
  return v ? Number(v) : null;
}

export async function markSeasonalAnswered(month: number) {
  await AsyncStorage.setItem(FORM_KEY, String(month));
}

export async function getCrushCredits(): Promise<number> {
  const v = await AsyncStorage.getItem(CRUSH_CREDITS_KEY);
  return v != null ? Number(v) || 0 : 0;
}

export async function setCrushCredits(n: number) {
  await AsyncStorage.setItem(CRUSH_CREDITS_KEY, String(n));
}

export async function spendCrushCredit(): Promise<boolean> {
  const c = await getCrushCredits();
  if (c <= 0) return false;
  await setCrushCredits(c - 1);
  return true;
}
