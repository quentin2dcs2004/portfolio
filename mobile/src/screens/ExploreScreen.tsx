import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../theme";

type Props = {
  onCrushNotes: () => void;
  onSeasonal: () => void;
  onQuiz: () => void;
  onSubscribe: () => void;
  onProfile: () => void;
};

export function ExploreScreen({ onCrushNotes, onSeasonal, onQuiz, onSubscribe, onProfile }: Props) {
  const { colors, mode, toggle } = useTheme();
  const styles = make(colors);

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.kicker}>MEETORA</Text>
      <Text style={styles.title}>Explorer</Text>
      <Text style={styles.sub}>Essaie les flux — tout est cliquable dans le cadre téléphone.</Text>

      <Pressable style={styles.themeBtn} onPress={toggle}>
        <Text style={styles.themeBtnText}>
          Thème : {mode === "dark" ? "Sombre" : "Clair"} · basculer
        </Text>
      </Pressable>

      <Tile
        styles={styles}
        emoji="💌"
        title="CrushNotes"
        desc="Message payant sans attendre le match"
        onPress={onCrushNotes}
        tint={colors.crushDim}
      />
      <Tile
        styles={styles}
        emoji="🍂"
        title="Formulaire du mois"
        desc="Signaux saisonniers YoYoMatch-style"
        onPress={onSeasonal}
        tint={colors.accentDim}
      />
      <Tile
        styles={styles}
        emoji="🎵"
        title="Quiz passion · Musique"
        desc="Points → boost profil 24 h"
        onPress={onQuiz}
        tint="rgba(94,200,255,0.15)"
      />
      <Tile
        styles={styles}
        emoji="✨"
        title="Profil Happn-like"
        desc="Photos, intentions emoji, actions"
        onPress={onProfile}
        tint="rgba(255,107,157,0.12)"
      />
      <Tile
        styles={styles}
        emoji="💎"
        title="Formules / abonnement"
        desc="Plus · Premium · Elite"
        onPress={onSubscribe}
        tint="rgba(107,140,255,0.15)"
      />
    </ScrollView>
  );
}

function Tile({
  styles,
  emoji,
  title,
  desc,
  onPress,
  tint,
}: {
  styles: ReturnType<typeof make>;
  emoji: string;
  title: string;
  desc: string;
  onPress: () => void;
  tint: string;
}) {
  return (
    <Pressable style={[styles.tile, { backgroundColor: tint }]} onPress={onPress}>
      <Text style={styles.tileEmoji}>{emoji}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.tileTitle}>{title}</Text>
        <Text style={styles.tileDesc}>{desc}</Text>
      </View>
      <Text style={styles.chev}>›</Text>
    </Pressable>
  );
}

function make(colors: ReturnType<typeof useTheme>["colors"]) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.bg },
    content: { padding: 16, paddingBottom: 40 },
    kicker: { color: colors.accent, fontWeight: "800", letterSpacing: 1, fontSize: 12 },
    title: { color: colors.text, fontSize: 28, fontWeight: "800", marginTop: 4 },
    sub: { color: colors.muted, marginBottom: 14, lineHeight: 20 },
    themeBtn: {
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.line,
      padding: 12,
      marginBottom: 14,
      backgroundColor: colors.bgElevated,
    },
    themeBtnText: { color: colors.text, fontWeight: "700", textAlign: "center" },
    tile: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      borderRadius: 16,
      padding: 14,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.line,
      minHeight: 76,
    },
    tileEmoji: { fontSize: 28 },
    tileTitle: { color: colors.text, fontWeight: "800", fontSize: 16 },
    tileDesc: { color: colors.muted, fontSize: 13, marginTop: 2 },
    chev: { color: colors.muted, fontSize: 28, fontWeight: "300" },
  });
}
