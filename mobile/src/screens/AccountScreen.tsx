import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../api";
import { formatDate, money } from "../format";
import { colors, spacing } from "../theme";
import type { Catalog, Subscription, Transaction } from "../types";

const EMAIL_KEY = "abonnement.email";

type Props = {
  initialEmail?: string;
};

export function AccountScreen({ initialEmail = "" }: Props) {
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [txs, setTxs] = useState<Transaction[]>([]);

  useEffect(() => {
    if (initialEmail) setEmail(initialEmail);
    else {
      AsyncStorage.getItem(EMAIL_KEY).then((v) => {
        if (v) setEmail(v);
      });
    }
  }, [initialEmail]);

  const load = useCallback(async () => {
    if (!email.trim()) {
      Alert.alert("E-mail requis");
      return;
    }
    try {
      setLoading(true);
      const [cat, data] = await Promise.all([
        catalog ? Promise.resolve(catalog) : api.catalog(),
        api.mySubscriptions(email.trim()),
      ]);
      setCatalog(cat);
      setSubs(data.subscriptions);
      setTxs(data.transactions);
      await AsyncStorage.setItem(EMAIL_KEY, email.trim());
    } catch (e) {
      Alert.alert("Erreur", e instanceof Error ? e.message : "Chargement impossible");
    } finally {
      setLoading(false);
    }
  }, [email, catalog]);

  useEffect(() => {
    if (email.trim()) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialEmail]);

  async function cancel(sub: Subscription) {
    try {
      await api.cancel(sub.id, !sub.auto_renew);
      Alert.alert(
        "Résiliation",
        sub.auto_renew
          ? "Renouvellement arrêté — accès jusqu’à la fin de période."
          : "Abonnement résilié immédiatement."
      );
      load();
    } catch (e) {
      Alert.alert("Erreur", e instanceof Error ? e.message : "Échec");
    }
  }

  async function extend(sub: Subscription) {
    try {
      await api.extend(sub.id, sub.duration.months);
      Alert.alert("Prolongation", `+${sub.duration.months} mois ajoutés.`);
      load();
    } catch (e) {
      Alert.alert("Erreur", e instanceof Error ? e.message : "Échec");
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Mon compte</Text>
        <Text style={styles.lead}>
          Gérer résiliation, prolongation et changement de formule.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor={colors.muted}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Pressable style={styles.cta} onPress={load}>
          <Text style={styles.ctaText}>{loading ? "Chargement…" : "Charger"}</Text>
        </Pressable>

        {loading && (
          <ActivityIndicator color={colors.accent} style={{ marginVertical: 16 }} />
        )}

        {!subs.length && !loading ? (
          <Text style={styles.muted}>Aucun abonnement pour cet e-mail.</Text>
        ) : null}

        {subs.map((s) => (
          <View key={s.id} style={styles.card}>
            <Text style={styles.cardTitle}>
              {s.plan.name} · {s.duration.label}
            </Text>
            <View
              style={[
                styles.badge,
                s.auto_renew ? styles.badgeRenew : styles.badgeFixed,
              ]}
            >
              <Text style={styles.badgeText}>
                {s.auto_renew ? "RENOUVELLEMENT AUTO" : "DURÉE FIXE"}
              </Text>
            </View>
            <Text style={styles.muted}>Statut : {s.status}</Text>
            <Text style={styles.muted}>Début : {formatDate(s.start_at)}</Text>
            <Text style={styles.muted}>Fin : {formatDate(s.end_at)}</Text>
            <Text style={styles.terms}>{s.renewal_terms_fr}</Text>
            <View style={styles.actions}>
              <Pressable style={styles.ghostBtn} onPress={() => extend(s)}>
                <Text style={styles.ghostText}>Prolonger</Text>
              </Pressable>
              <Pressable style={styles.dangerBtn} onPress={() => cancel(s)}>
                <Text style={styles.dangerText}>
                  {s.auto_renew ? "Stop renouvellement" : "Résilier"}
                </Text>
              </Pressable>
            </View>
          </View>
        ))}

        <Text style={styles.section}>Transactions</Text>
        {txs.map((t) => (
          <View key={t.id} style={styles.txRow}>
            <Text style={styles.txMain}>
              {t.tx_type} · {money(t.amount_cents, t.currency)}
            </Text>
            <Text style={styles.muted}>{formatDate(t.created_at)}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.md, paddingBottom: 48 },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.8,
  },
  lead: { color: colors.muted, marginBottom: spacing.md, marginTop: 4 },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.bgElevated,
    color: colors.text,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: spacing.sm,
    fontSize: 16,
  },
  cta: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  ctaText: { color: "#04150e", fontWeight: "800" },
  card: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.bgCard,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardTitle: { color: colors.text, fontSize: 20, fontWeight: "800", marginBottom: 8 },
  badge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
  },
  badgeRenew: { backgroundColor: colors.accentDim },
  badgeFixed: { backgroundColor: colors.fixedDim },
  badgeText: { color: colors.text, fontSize: 11, fontWeight: "800" },
  muted: { color: colors.muted, marginTop: 2 },
  terms: { color: colors.muted, fontSize: 13, marginTop: 8, lineHeight: 18 },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  ghostBtn: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  ghostText: { color: colors.text, fontWeight: "700" },
  dangerBtn: {
    borderWidth: 1,
    borderColor: "rgba(239,122,106,0.4)",
    backgroundColor: "rgba(239,122,106,0.12)",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  dangerText: { color: colors.danger, fontWeight: "700" },
  section: {
    color: colors.text,
    fontWeight: "800",
    fontSize: 18,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  txRow: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    paddingVertical: 10,
  },
  txMain: { color: colors.text, fontWeight: "600" },
});
