import { Platform, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { colors } from "../theme";

/** iPhone 14-ish frame for Expo web — Try Live must look like a phone app. */
export const PHONE_WIDTH = 390;
export const PHONE_HEIGHT = 844;

type Props = {
  children: React.ReactNode;
};

export function PhoneShell({ children }: Props) {
  const { width, height } = useWindowDimensions();

  if (Platform.OS !== "web") {
    return <View style={styles.nativeFill}>{children}</View>;
  }

  const maxW = Math.min(PHONE_WIDTH, width - 32);
  const maxH = Math.min(PHONE_HEIGHT, height - 56);
  const scale = Math.min(maxW / PHONE_WIDTH, maxH / PHONE_HEIGHT, 1);
  const frameW = Math.round(PHONE_WIDTH * scale);
  const frameH = Math.round(PHONE_HEIGHT * scale);
  const pad = Math.max(8, Math.round(10 * scale));
  const radius = Math.round(40 * scale);

  return (
    <View style={styles.desktop} accessibilityLabel="Aperçu téléphone Meetora">
      <Text style={styles.caption}>Meetora · aperçu téléphone · {PHONE_WIDTH}×{PHONE_HEIGHT}</Text>
      <View
        style={[
          styles.bezel,
          {
            width: frameW,
            height: frameH,
            borderRadius: radius,
            padding: pad,
          },
        ]}
      >
        <View style={styles.islandRow} pointerEvents="none">
          <View
            style={[
              styles.island,
              {
                width: Math.round(120 * scale),
                height: Math.round(34 * scale),
                borderRadius: Math.round(18 * scale),
              },
            ]}
          />
        </View>
        <View style={[styles.screen, { borderRadius: Math.round(32 * scale) }]}>{children}</View>
        <View style={styles.homeRow} pointerEvents="none">
          <View
            style={[
              styles.homeBar,
              {
                width: Math.round(130 * scale),
                height: Math.max(4, Math.round(5 * scale)),
                borderRadius: 3,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nativeFill: { flex: 1 },
  desktop: {
    flex: 1,
    width: "100%",
    minHeight: 900,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#050807",
    paddingVertical: 16,
    gap: 12,
  },
  caption: {
    color: "rgba(232, 242, 236, 0.55)",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  bezel: {
    backgroundColor: "#141816",
    borderWidth: 2,
    borderColor: "#2a312e",
    shadowColor: "#000",
    shadowOpacity: 0.6,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 20 },
    overflow: "hidden",
  },
  islandRow: {
    position: "absolute",
    top: 14,
    left: 0,
    right: 0,
    zIndex: 30,
    alignItems: "center",
  },
  island: {
    backgroundColor: "#050607",
  },
  screen: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: colors.bg,
  },
  homeRow: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    zIndex: 30,
    alignItems: "center",
  },
  homeBar: {
    backgroundColor: "rgba(255,255,255,0.4)",
  },
});
