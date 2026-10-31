import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { FEED_PROFILES } from "../data/feedProfiles";
import { useTheme } from "../theme";

type Props = {
  onCrushNotes: () => void;
  onOpenThread?: (name: string) => void;
};

export function MessagesScreen({ onCrushNotes, onOpenThread }: Props) {
  const { colors } = useTheme();
  const styles = make(colors);
  const threads = FEED_PROFILES.slice(0, 3);

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Messages</Text>
      <Pressable style={styles.crushBanner} onPress={onCrushNotes}>
        <Text style={styles.crushTitle}>CrushNotes</Text>
        <Text style={styles.crushSub}>Écrire sans match · payant</Text>
      </Pressable>
      {threads.map((p, i) => (
        <Pressable
          key={p.id}
          style={styles.row}
          onPress={() => onOpenThread?.(p.displayName)}
        >
          <Image source={{ uri: p.photos[0] }} style={styles.avatar} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{p.displayName}</Text>
            <Text style={styles.preview} numberOfLines={1}>
              {i === 0 ? "On se croise souvent vers Bellecour ?" : "Salut ! Content d’avoir matché 👋"}
            </Text>
          </View>
          <Text style={styles.time}>{i === 0 ? "2 min" : "Hier"}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

function make(colors: ReturnType<typeof useTheme>["colors"]) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.bg },
    content: { padding: 16, paddingBottom: 32 },
    title: { color: colors.text, fontSize: 28, fontWeight: "800", marginBottom: 12 },
    crushBanner: {
      backgroundColor: colors.crushDim,
      borderColor: colors.crush,
      borderWidth: 1,
      borderRadius: 14,
      padding: 14,
      marginBottom: 16,
    },
    crushTitle: { color: colors.crush, fontWeight: "800", fontSize: 16 },
    crushSub: { color: colors.muted, marginTop: 2, fontSize: 13 },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
    },
    avatar: { width: 54, height: 54, borderRadius: 27 },
    name: { color: colors.text, fontWeight: "800", fontSize: 16 },
    preview: { color: colors.muted, marginTop: 2, fontSize: 13 },
    time: { color: colors.muted, fontSize: 11 },
  });
}
