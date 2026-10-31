import { useCallback, useEffect, useMemo, useState } from "react";
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
import { money, formatDate } from "../format";
import { colors, spacing } from "../theme";
import type { Catalog, Quote } from "../types";
import { API_URL } from "../config";

const EMAIL_KEY = "meetora.email";

type Props = {
  onSubscribed: (email: string) => void;
};

export function SubscribeScreen({ onSubscribed }: Props) {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [quoting, setQuoting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [planSlug, setPlanSlug] = useState<string>("premium");
  const [months, setMonths] = useState<number>(3);
  const [autoRenew, setAutoRenew] = useState(false);
  const [email, setEmail] = useState("");
  const [promo, setPromo] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(EMAIL_KEY).then((v) => {
      if (v) setEmail(v);
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await api.catalog();
        if (cancelled) return;
        setCatalog(data);
        const preferred =
          data.plans.find((p) => p.slug === "premium") || data.plans[0];
        const slug = preferred?.slug || "premium";
        setPlanSlug(slug);
        const tariffs = data.tariffs.filter((t) => t.plan_slug === slug);
        const m = tariffs.find((t) => t.months === 3)?.months || tariffs[0]?.months || 1;
        setMonths(m);
        setError(null);
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error
              ? `${e.message}\nAPI: ${API_URL}`
              : `Impossible de charger le catalogue.\nAPI: ${API_URL}`
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const planTariffs = useMemo(() => {
    if (!catalog) return [];
    return catalog.tariffs.filter((t) => t.plan_slug === planSlug && t.enabled);
  }, [catalog, planSlug]);

  const refreshQuote = useCallback(async () => {
    if (!planSlug || !months) return;
    try {
      setQuoting(true);
      const q = await api.quote({
        plan: planSlug,
        months,
        auto_renew: autoRenew,
        promo_code: promo.trim() || undefined,
        email: email.trim() || undefined,
      });
      setQuote(q);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Quote impossible");
    } finally {
      setQuoting(false);
    }
  }, [planSlug, months, autoRenew, promo, email]);

  useEffect(() => {
    if (!catalog) return;
    const t = setTimeout(() => {
      refreshQuote();
    }, 200);
    return () => clearTimeout(t);
  }, [catalog, refreshQuote]);

  async function onSubscribe() {
    if (!email.trim()) {
      Alert.alert("E-mail requis", "Indiquez votre e-mail pour souscrire.");
      return;
    }
    try {
      setSubmitting(true);
      await api.subscribe({
        email: email.trim(),
        plan: planSlug,
        months,
        auto_renew: autoRenew,
        promo_code: promo.trim() || undefined,
      });
      await AsyncStorage.setItem(EMAIL_KEY, email.trim());
      Alert.alert("Meetora activé", "Votre période commence immédiatement (simulation).");
      onSubscribed(email.trim());
    } catch (e) {
      Alert.alert("Échec", e instanceof Error ? e.message : "Souscription impossible");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} size="large" />
          <Text style={styles.muted}>Chargement du catalogue…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!catalog) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.title}>Catalogue indisponible</Text>
          <Text style={styles.muted}>{error}</Text>
          <Text style={[styles.muted, { marginTop: spacing.md }]}>
            Démarrez l’API : cd abonnement && npm start
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const selectedPlan = catalog.plans.find((p) => p.slug === planSlug);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.brand}>Meetora</Text>
        <Text style={styles.title}>Choisissez votre durée</Text>
        <Text style={styles.lead}>
          Plus, Premium ou Elite — tarifs Meetora chargés dynamiquement, jamais figés dans l’app.
        </Text>

        <Text style={styles.sectionLabel}>Formule</Text>
        <View style={styles.planColumn}>
          {catalog.plans.map((plan) => {
            const selected = plan.slug === planSlug;
            return (
              <Pressable
                key={plan.slug}
                onPress={() => {
                  setPlanSlug(plan.slug);
                  const next = catalog.tariffs.filter((t) => t.plan_slug === plan.slug);
                  if (!next.find((t) => t.months === months)) {
                    setMonths(next[0]?.months || 1);
                  }
                }}
                style={[styles.planCard, selected && styles.planCardSelected]}
              >
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.planTag}>{plan.tagline}</Text>
                {plan.features.slice(0, 3).map((f) => (
                  <Text key={f} style={styles.feature}>
                    ▸ {f}
                  </Text>
                ))}
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>Durée</Text>
        <View style={styles.chipRow}>
          {planTariffs.map((t) => {
            const selected = t.months === months;
            return (
              <Pressable
                key={t.id}
                onPress={() => setMonths(t.months)}
                style={[styles.chip, selected && styles.chipSelected]}
              >
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                  {t.duration_label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>Engagement</Text>
        <View style={styles.modelRow}>
          <Pressable
            onPress={() => setAutoRenew(false)}
            style={[
              styles.modelCard,
              !autoRenew && styles.modelFixedSelected,
            ]}
          >
            <Text style={styles.modelTitle}>Durée fixe</Text>
            <Text style={styles.modelBody}>
              Aucun renouvellement automatique. Accès jusqu’à la date de fin.
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setAutoRenew(true)}
            style={[
              styles.modelCard,
              autoRenew && styles.modelRenewSelected,
            ]}
          >
            <Text style={styles.modelTitle}>Renouvellement auto</Text>
            <Text style={styles.modelBody}>
              Renouvelé à la même durée sauf résiliation dans le compte.
            </Text>
          </Pressable>
        </View>

        <Text style={styles.sectionLabel}>Vos informations</Text>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor={colors.muted}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          onEndEditing={refreshQuote}
        />
        <TextInput
          style={styles.input}
          placeholder="Code promo (optionnel)"
          placeholderTextColor={colors.muted}
          autoCapitalize="characters"
          value={promo}
          onChangeText={setPromo}
          onEndEditing={refreshQuote}
        />

        {!!catalog.promotions.length && (
          <Text style={styles.promoHint}>
            Offres :{" "}
            {catalog.promotions
              .map((p) => (p.code ? `${p.name} (${p.code})` : p.name))
              .join(" · ")}
          </Text>
        )}

        <View style={styles.summary}>
          <View
            style={[
              styles.badge,
              autoRenew ? styles.badgeRenew : styles.badgeFixed,
            ]}
          >
            <Text style={styles.badgeText}>
              {autoRenew ? "RENOUVELLEMENT AUTO" : "DURÉE FIXE · SANS AUTO-RENOUVELLEMENT"}
            </Text>
          </View>
          <Text style={styles.summaryPlan}>
            {selectedPlan?.name || "—"} · {quote?.duration.label || "—"}
            {quoting ? " …" : ""}
          </Text>
          <Text style={styles.priceTotal}>
            {quote ? money(quote.pricing.total_price_cents, quote.pricing.currency) : "—"}
          </Text>
          <Text style={styles.priceMonthly}>
            {quote
              ? `soit ${money(
                  quote.pricing.monthly_equivalent_cents,
                  quote.pricing.currency
                )} / mois en moyenne`
              : "—"}
          </Text>
          {!!quote?.pricing.savings_cents && (
            <Text style={styles.savings}>
              Vous économisez {money(quote.pricing.savings_cents, quote.pricing.currency)} (
              {quote.pricing.savings_percent} %)
            </Text>
          )}
          <View style={styles.metaBlock}>
            <Meta label="Fin de période" value={formatDate(quote?.end_at)} />
            <Meta
              label="Renouvellement"
              value={
                quote?.auto_renew ? formatDate(quote.renewal_at) : "Aucun — durée fixe"
              }
            />
            <Meta
              label="Réduction durée"
              value={`${quote?.pricing.duration_discount_percent ?? 0} %`}
            />
          </View>
          <Text style={styles.terms}>{quote?.renewal_terms_fr}</Text>
          {quote?.promo && (
            <Text style={styles.promoApplied}>
              Promo appliquée : {quote.promo.name}
              {quote.promo.code ? ` (${quote.promo.code})` : ""}
            </Text>
          )}
          <Pressable
            style={[styles.cta, submitting && { opacity: 0.6 }]}
            disabled={submitting}
            onPress={onSubscribe}
          >
            <Text style={styles.ctaText}>{submitting ? "Traitement…" : "Souscrire"}</Text>
          </Pressable>
          <Text style={styles.legal}>
            Simulation sans paiement réel. Conditions de renouvellement et de résiliation
            présentées avant engagement.
          </Text>
        </View>

        <Text style={styles.sectionLabel}>Comparatif</Text>
        <View style={styles.compare}>
          {catalog.feature_matrix.rows.map((row) => (
            <View key={row.feature} style={styles.compareRow}>
              <Text style={styles.compareFeature}>{row.feature}</Text>
              <View style={styles.comparePlans}>
                {catalog.plans.map((p) => (
                  <Text
                    key={p.slug}
                    style={[
                      styles.compareCell,
                      row.plans[p.slug] ? styles.yes : styles.no,
                    ]}
                  >
                    {p.name}: {row.plans[p.slug] ? "Oui" : "—"}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaRow}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.md, paddingBottom: 48 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.lg },
  brand: {
    color: colors.accent,
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.8,
    marginBottom: spacing.xs,
  },
  lead: { color: colors.muted, fontSize: 16, lineHeight: 22, marginBottom: spacing.lg },
  sectionLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  planColumn: { gap: spacing.sm },
  planCard: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.bgCard,
    borderRadius: 14,
    padding: spacing.md,
  },
  planCardSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accentDim,
  },
  planName: { color: colors.text, fontSize: 22, fontWeight: "800" },
  planTag: { color: colors.muted, marginTop: 4, marginBottom: 8 },
  feature: { color: colors.text, fontSize: 14, marginTop: 2 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  chipSelected: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { color: colors.text, fontWeight: "600" },
  chipTextSelected: { color: "#062016" },
  modelRow: { gap: spacing.sm },
  modelCard: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    padding: spacing.md,
    backgroundColor: colors.bgElevated,
  },
  modelFixedSelected: {
    borderColor: colors.fixed,
    backgroundColor: colors.fixedDim,
  },
  modelRenewSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accentDim,
  },
  modelTitle: { color: colors.text, fontWeight: "800", fontSize: 16, marginBottom: 4 },
  modelBody: { color: colors.muted, lineHeight: 20 },
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
  promoHint: { color: colors.muted, fontSize: 13, marginBottom: spacing.sm },
  summary: {
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    padding: spacing.md,
  },
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
  summaryPlan: { color: colors.muted, marginBottom: 4 },
  priceTotal: { color: colors.text, fontSize: 34, fontWeight: "800", letterSpacing: -1 },
  priceMonthly: { color: colors.muted, marginBottom: 8 },
  savings: { color: colors.accent, fontWeight: "700", marginBottom: 12 },
  metaBlock: { gap: 8, marginBottom: 12 },
  metaRow: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  metaLabel: { color: colors.muted },
  metaValue: { color: colors.text, fontWeight: "600", flexShrink: 1, textAlign: "right" },
  terms: { color: colors.muted, fontSize: 13, lineHeight: 18, marginBottom: 10 },
  promoApplied: { color: colors.warn, marginBottom: 10, fontWeight: "600" },
  cta: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  ctaText: { color: "#04150e", fontWeight: "800", fontSize: 16 },
  legal: { color: colors.muted, fontSize: 12, marginTop: 10, lineHeight: 16 },
  compare: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: colors.bgElevated,
  },
  compareRow: {
    padding: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  compareFeature: { color: colors.text, fontWeight: "700", marginBottom: 4 },
  comparePlans: { gap: 2 },
  compareCell: { fontSize: 13 },
  yes: { color: colors.accent },
  no: { color: "#5a7166" },
  muted: { color: colors.muted, textAlign: "center" },
  error: { color: colors.danger, marginTop: spacing.md },
});
