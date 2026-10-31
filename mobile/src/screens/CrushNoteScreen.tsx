import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useTheme } from "../theme";
import { getCrushCredits, setCrushCredits, spendCrushCredit } from "../state/meetoraStore";
import { DEMO_PROFILE } from "../data/demoProfile";

type Props = { onDone?: () => void };

export function CrushNoteScreen({ onDone }: Props) {
  const { colors } = useTheme();
  const [credits, setCredits] = useState(0);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    getCrushCredits().then(setCredits);
  }, []);

  async function buyPack() {
    const next = credits + 3;
    await setCrushCredits(next);
    setCredits(next);
    Alert.alert("CrushNotes", "Pack de 3 CrushNotes ajouté (simulation — pas de paiement réel).");
  }

  async function send() {
    if (!message.trim()) {
      Alert.alert("Message vide", "Écris quelques mots pour ton CrushNote.");
      return;
    }
    if (credits <= 0) {
      Alert.alert("Paywall CrushNotes", "Il te faut un crédit CrushNote pour écrire sans match.", [
        { text: "Acheter 3 · 4,99 €", onPress: buyPack },
        { text: "Annuler", style: "cancel" },
      ]);
      return;
    }
    const ok = await spendCrushCredit();
    if (!ok) return;
    setCredits((c) => c - 1);
    setSent(true);
  }

  const styles = make(colors);

  if (sent) {
    return (
      <View style={styles.root}>
        <Text style={styles.emoji}>💌</Text>
        <Text style={styles.title}>CrushNote envoyé</Text>
        <Text style={styles.sub}>
          {DEMO_PROFILE.displayName} peut te répondre sans match mutuel. Crédits restants : {credits}.
        </Text>
        <Pressable style={styles.cta} onPress={onDone}>
          <Text style={styles.ctaText}>Retour</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <Text style={styles.kicker}>CRUSHNOTES · PAYANT</Text>
      <Text style={styles.title}>Écrire sans attendre le match</Text>
      <Text style={styles.sub}>
        Contourne le match mutuel : envoie un message cash à {DEMO_PROFILE.displayName}. 1 crédit =
        1 CrushNote.
      </Text>
      <View style={styles.creditRow}>
        <Text style={styles.credit}>Crédits : {credits}</Text>
        <Pressable style={styles.buy} onPress={buyPack}>
          <Text style={styles.buyText}>+3 · 4,99 €</Text>
        </Pressable>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Ton CrushNote…"
        placeholderTextColor={colors.muted}
        multiline
        value={message}
        onChangeText={setMessage}
        maxLength={280}
      />
      <Pressable style={styles.cta} onPress={send}>
        <Text style={styles.ctaText}>{credits > 0 ? "Envoyer le CrushNote" : "Débloquer pour envoyer"}</Text>
      </Pressable>
      <Text style={styles.legal}>Simulation Meetora — aucun prélèvement réel.</Text>
    </View>
  );
}

function make(colors: ReturnType<typeof useTheme>["colors"]) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.bg, padding: 16 },
    kicker: { color: colors.crush, fontWeight: "800", fontSize: 12, letterSpacing: 1, marginBottom: 8 },
    title: { color: colors.text, fontSize: 26, fontWeight: "800", letterSpacing: -0.5, marginBottom: 8 },
    sub: { color: colors.muted, lineHeight: 21, marginBottom: 16 },
    creditRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
    credit: { color: colors.text, fontWeight: "700" },
    buy: {
      backgroundColor: colors.crushDim,
      borderColor: colors.crush,
      borderWidth: 1,
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    buyText: { color: colors.crush, fontWeight: "800", fontSize: 13 },
    input: {
      minHeight: 120,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.line,
      backgroundColor: colors.bgElevated,
      color: colors.text,
      padding: 14,
      textAlignVertical: "top",
      marginBottom: 14,
      fontSize: 16,
    },
    cta: {
      backgroundColor: colors.crush,
      borderRadius: 14,
      minHeight: 52,
      alignItems: "center",
      justifyContent: "center",
    },
    ctaText: { color: "#1a0e08", fontWeight: "800", fontSize: 16 },
    legal: { color: colors.muted, fontSize: 12, marginTop: 12, textAlign: "center" },
    emoji: { fontSize: 48, marginBottom: 12 },
  });
}
