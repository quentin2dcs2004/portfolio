import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { DEMO_PROFILE, MEMBERSHIP_LABELS } from "../data/demoProfile";
import { intentionById } from "../data/intentions";
import { useTheme } from "../theme";

type Props = {
  onSubscribe: () => void;
  onSeasonal: () => void;
  onQuiz: () => void;
  onCrushNotes: () => void;
};

export function MyProfileTab({ onSubscribe, onSeasonal, onQuiz, onCrushNotes }: Props) {
  const { colors, mode, toggle } = useTheme();
  const p = DEMO_PROFILE;
  const styles = make(colors);

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Image source={{ uri: p.photos[0] }} style={styles.hero} />
      <Text style={styles.name}>
        {p.displayName}, {p.age}
      </Text>
      <Text style={styles.meta}>
        {MEMBERSHIP_LABELS[p.membership]} · {p.city}
      </Text>
      <View style={styles.intentions}>
        {p.intentionIds.map((id) => {
          const it = intentionById(id);
          return it ? (
            <Text key={id} style={styles.intention}>
              {it.emoji} {it.label}
            </Text>
          ) : null;
        })}
      </View>
      <Text style={styles.bio}>{p.bio}</Text>

      <Text style={styles.section}>Réglages & extras</Text>
      <Row styles={styles} label={`Thème · ${mode === "dark" ? "Sombre" : "Clair"}`} onPress={toggle} />
      <Row styles={styles} label="Formules Premium" onPress={onSubscribe} />
      <Row styles={styles} label="CrushNotes" onPress={onCrushNotes} />
      <Row styles={styles} label="Formulaire du mois" onPress={onSeasonal} />
      <Row styles={styles} label="Quiz passion · Musique" onPress={onQuiz} />
      <Row
        styles={styles}
        label="Modifier le profil"
        onPress={() => Alert.alert("Modifier", "Placeholder — photo, bio, intentions.")}
      />
    </ScrollView>
  );
}

function Row({
  styles,
  label,
  onPress,
}: {
  styles: ReturnType<typeof make>;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <Text style={styles.rowText}>{label}</Text>
      <Text style={styles.chev}>›</Text>
    </Pressable>
  );
}

function make(colors: ReturnType<typeof useTheme>["colors"]) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.bg },
    content: { paddingBottom: 40 },
    hero: { width: "100%", height: 280, backgroundColor: "#222" },
    name: {
      color: colors.text,
      fontSize: 28,
      fontWeight: "800",
      marginTop: 14,
      marginHorizontal: 16,
    },
    meta: { color: colors.accent, fontWeight: "700", marginHorizontal: 16, marginTop: 4 },
    intentions: { flexDirection: "row", flexWrap: "wrap", gap: 8, margin: 16, marginBottom: 8 },
    intention: {
      color: colors.text,
      backgroundColor: colors.bgElevated,
      borderWidth: 1,
      borderColor: colors.line,
      overflow: "hidden",
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 6,
      fontWeight: "700",
      fontSize: 12,
    },
    bio: { color: colors.muted, marginHorizontal: 16, lineHeight: 21, marginBottom: 18 },
    section: {
      color: colors.muted,
      fontWeight: "800",
      fontSize: 12,
      letterSpacing: 0.5,
      textTransform: "uppercase",
      marginHorizontal: 16,
      marginBottom: 8,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
    },
    rowText: { color: colors.text, fontWeight: "600", fontSize: 15 },
    chev: { color: colors.muted, fontSize: 22 },
  });
}
