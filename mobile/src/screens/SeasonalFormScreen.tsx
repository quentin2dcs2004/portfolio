import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { formForMonth } from "../data/seasonalForms";
import { getSeasonalAnsweredMonth, markSeasonalAnswered } from "../state/meetoraStore";
import { useTheme } from "../theme";

type Props = { onDone?: () => void };

export function SeasonalFormScreen({ onDone }: Props) {
  const { colors } = useTheme();
  const form = formForMonth();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [locked, setLocked] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    getSeasonalAnsweredMonth().then((m) => {
      if (m === form.month) setLocked(true);
    });
  }, [form.month]);

  const styles = make(colors);
  const allAnswered = form.questions.every((q) => answers[q.id]);

  async function submit() {
    if (!allAnswered || locked) return;
    await markSeasonalAnswered(form.month);
    setLocked(true);
    setJustSaved(true);
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.season}>{form.season.toUpperCase()}</Text>
      <Text style={styles.title}>{form.title}</Text>
      <Text style={styles.sub}>{form.subtitle}</Text>

      {locked && (
        <View style={styles.lockBanner}>
          <Text style={styles.lockText}>
            {justSaved ? "Réponses enregistrées. " : ""}
            Déjà répondu ce mois — prochain formulaire le mois prochain.
          </Text>
        </View>
      )}

      {form.questions.map((q) => (
        <View key={q.id} style={styles.card}>
          <Text style={styles.prompt}>{q.prompt}</Text>
          {q.options.map((opt) => {
            const on = answers[q.id] === opt;
            return (
              <Pressable
                key={opt}
                disabled={locked}
                onPress={() => setAnswers((a) => ({ ...a, [q.id]: opt }))}
                style={[styles.option, on && styles.optionOn, locked && styles.optionDisabled]}
              >
                <Text style={[styles.optionText, on && styles.optionTextOn]}>{opt}</Text>
              </Pressable>
            );
          })}
        </View>
      ))}

      {!locked && (
        <Pressable
          style={[styles.cta, !allAnswered && { opacity: 0.45 }]}
          disabled={!allAnswered}
          onPress={submit}
        >
          <Text style={styles.ctaText}>Valider mon mois</Text>
        </Pressable>
      )}
      {locked && (
        <Pressable style={styles.secondary} onPress={onDone}>
          <Text style={styles.secondaryText}>Retour</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

function make(colors: ReturnType<typeof useTheme>["colors"]) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.bg },
    content: { padding: 16, paddingBottom: 40 },
    season: { color: colors.accent2, fontWeight: "800", fontSize: 12, letterSpacing: 1 },
    title: { color: colors.text, fontSize: 24, fontWeight: "800", marginTop: 6, marginBottom: 6 },
    sub: { color: colors.muted, marginBottom: 14, lineHeight: 20 },
    lockBanner: {
      backgroundColor: colors.accentDim,
      borderRadius: 12,
      padding: 12,
      marginBottom: 14,
      borderWidth: 1,
      borderColor: colors.accent,
    },
    lockText: { color: colors.text, fontWeight: "600", fontSize: 13, lineHeight: 18 },
    card: {
      backgroundColor: colors.bgCard,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.line,
      padding: 14,
      marginBottom: 12,
    },
    prompt: { color: colors.text, fontWeight: "700", fontSize: 15, marginBottom: 10 },
    option: {
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.line,
      paddingVertical: 12,
      paddingHorizontal: 12,
      marginBottom: 8,
      backgroundColor: colors.bgElevated,
    },
    optionOn: { borderColor: colors.accent, backgroundColor: colors.accentDim },
    optionDisabled: { opacity: 0.7 },
    optionText: { color: colors.text, fontWeight: "600" },
    optionTextOn: { color: colors.accent },
    cta: {
      backgroundColor: colors.accent,
      borderRadius: 14,
      minHeight: 52,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 8,
    },
    ctaText: { color: "#1a0a12", fontWeight: "800", fontSize: 16 },
    secondary: {
      marginTop: 10,
      borderRadius: 14,
      minHeight: 48,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.line,
    },
    secondaryText: { color: colors.text, fontWeight: "700" },
  });
}
