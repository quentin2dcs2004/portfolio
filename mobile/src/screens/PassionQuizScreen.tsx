import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MUSIC_QUIZ } from "../data/quizMusic";
import { addPoints, getBoostUntil, getPoints, grantBoostHours } from "../state/meetoraStore";
import { useTheme } from "../theme";

type Props = { onDone?: () => void };

export function PassionQuizScreen({ onDone }: Props) {
  const { colors } = useTheme();
  const [idx, setIdx] = useState(0);
  const [points, setPoints] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [boostUntil, setBoostUntil] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  const q = MUSIC_QUIZ.questions[idx];

  useEffect(() => {
    getPoints().then(setPoints);
    getBoostUntil().then(setBoostUntil);
  }, []);

  const styles = make(colors);

  async function choose(i: number) {
    if (picked != null) return;
    setPicked(i);
    const correct = i === q.correctIndex;
    let nextPts = points;
    if (correct) {
      nextPts = await addPoints(MUSIC_QUIZ.pointsPerCorrect);
      setPoints(nextPts);
    }
    setTimeout(async () => {
      if (idx + 1 >= MUSIC_QUIZ.questions.length) {
        setFinished(true);
        if (nextPts >= MUSIC_QUIZ.boostThreshold) {
          const until = await grantBoostHours(24);
          setBoostUntil(until);
          Alert.alert("Récompense", "75 pts atteints → Boost profil 24 h débloqué !");
        }
      } else {
        setIdx((x) => x + 1);
        setPicked(null);
      }
    }, 650);
  }

  if (finished) {
    return (
      <View style={styles.root}>
        <Text style={styles.title}>Quiz terminé</Text>
        <Text style={styles.sub}>Score : {points} pts</Text>
        {boostUntil && (
          <Text style={styles.boost}>Boost actif jusqu’au {new Date(boostUntil).toLocaleString("fr-FR")}</Text>
        )}
        <Pressable style={styles.cta} onPress={onDone}>
          <Text style={styles.ctaText}>Retour</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <Text style={styles.kicker}>JEUX · PASSIONS</Text>
      <Text style={styles.title}>{MUSIC_QUIZ.title}</Text>
      <Text style={styles.sub}>{MUSIC_QUIZ.subtitle}</Text>
      <Text style={styles.progress}>
        Question {idx + 1}/{MUSIC_QUIZ.questions.length} · {points} pts
        {points >= MUSIC_QUIZ.boostThreshold ? " · Boost dispo" : ` · Boost à ${MUSIC_QUIZ.boostThreshold}`}
      </Text>

      <View style={styles.clip}>
        <Text style={styles.clipLabel}>{q.clipLabel}</Text>
        <View style={styles.wave}>
          {[0.4, 0.7, 1, 0.55, 0.85, 0.5, 0.95, 0.6].map((h, i) => (
            <View key={i} style={[styles.bar, { height: 18 + h * 28, backgroundColor: colors.accent2 }]} />
          ))}
        </View>
        <Text style={styles.vibe}>{q.vibe}</Text>
      </View>

      {q.choices.map((c, i) => {
        let border = colors.line;
        let bg = colors.bgElevated;
        if (picked != null) {
          if (i === q.correctIndex) {
            border = "#3ecf8e";
            bg = "rgba(62,207,142,0.15)";
          } else if (i === picked) {
            border = colors.danger;
            bg = "rgba(255,122,106,0.12)";
          }
        }
        return (
          <Pressable
            key={c}
            onPress={() => choose(i)}
            style={[styles.choice, { borderColor: border, backgroundColor: bg }]}
          >
            <Text style={styles.choiceText}>{c}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function make(colors: ReturnType<typeof useTheme>["colors"]) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.bg },
    kicker: { color: colors.accent2, fontWeight: "800", fontSize: 12, letterSpacing: 1 },
    title: { color: colors.text, fontSize: 24, fontWeight: "800", marginTop: 6 },
    sub: { color: colors.muted, marginVertical: 8, lineHeight: 20 },
    progress: { color: colors.accent, fontWeight: "700", marginBottom: 14 },
    clip: {
      borderRadius: 18,
      padding: 16,
      marginBottom: 14,
      backgroundColor: colors.bgCard,
      borderWidth: 1,
      borderColor: colors.line,
    },
    clipLabel: { color: colors.text, fontWeight: "800", marginBottom: 10 },
    wave: { flexDirection: "row", alignItems: "flex-end", gap: 6, height: 52, marginBottom: 10 },
    bar: { width: 10, borderRadius: 4, opacity: 0.9 },
    vibe: { color: colors.muted, fontStyle: "italic", lineHeight: 19 },
    choice: {
      borderWidth: 1,
      borderRadius: 14,
      padding: 14,
      marginBottom: 10,
    },
    choiceText: { color: colors.text, fontWeight: "600", fontSize: 15 },
    cta: {
      marginTop: 16,
      marginHorizontal: 16,
      backgroundColor: colors.accent,
      borderRadius: 14,
      minHeight: 52,
      alignItems: "center",
      justifyContent: "center",
    },
    ctaText: { color: "#1a0a12", fontWeight: "800", fontSize: 16 },
    boost: { color: colors.warn, fontWeight: "700", marginHorizontal: 16, marginTop: 8 },
  });
}
