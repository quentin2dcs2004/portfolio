import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { FEED_PROFILES } from "../data/feedProfiles";
import { useTheme } from "../theme";

type Props = { onOpenCrush?: () => void };

export function LikesScreen({ onOpenCrush }: Props) {
  const { colors } = useTheme();
  const styles = make(colors);
  const likes = FEED_PROFILES.slice(0, 4);

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Likes</Text>
      <Text style={styles.sub}>Personnes qui t’ont liké après un croisement.</Text>
      <View style={styles.grid}>
        {likes.map((p) => (
          <Pressable key={p.id} style={styles.card} onPress={onOpenCrush}>
            <Image source={{ uri: p.photos[0] }} style={styles.photo} />
            <View style={styles.overlay}>
              <Text style={styles.name}>
                {p.displayName}, {p.age}
              </Text>
              <Text style={styles.dist}>{p.distanceLabel}</Text>
            </View>
          </Pressable>
        ))}
      </View>
      <Pressable style={styles.crushCta} onPress={onOpenCrush}>
        <Text style={styles.crushCtaText}>Envoyer un CrushNote ✉</Text>
      </Pressable>
    </ScrollView>
  );
}

function make(colors: ReturnType<typeof useTheme>["colors"]) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.bg },
    content: { padding: 16, paddingBottom: 32 },
    title: { color: colors.text, fontSize: 28, fontWeight: "800" },
    sub: { color: colors.muted, marginBottom: 14, marginTop: 4 },
    grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    card: {
      width: "48%",
      aspectRatio: 0.72,
      borderRadius: 16,
      overflow: "hidden",
      backgroundColor: "#222",
    },
    photo: { width: "100%", height: "100%" },
    overlay: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      padding: 10,
      backgroundColor: "rgba(0,0,0,0.45)",
    },
    name: { color: "#fff", fontWeight: "800", fontSize: 15 },
    dist: { color: "rgba(255,255,255,0.8)", fontSize: 11, marginTop: 2 },
    crushCta: {
      marginTop: 18,
      borderRadius: 14,
      minHeight: 48,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.crush,
    },
    crushCtaText: { color: "#1a0e08", fontWeight: "800" },
  });
}
