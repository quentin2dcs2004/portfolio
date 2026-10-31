import { Platform } from "react-native";

/**
 * API base URL for the Express catalog/billing server (`abonnement/`).
 * Override with EXPO_PUBLIC_API_URL (e.g. http://192.168.x.x:3847 on a physical device).
 */
function defaultApiUrl() {
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL.replace(/\/$/, "");
  // Android emulator reaches host machine via 10.0.2.2
  if (Platform.OS === "android") return "http://10.0.2.2:3847";
  // iOS simulator + web can use localhost
  return "http://localhost:3847";
}

export const API_URL = defaultApiUrl();
