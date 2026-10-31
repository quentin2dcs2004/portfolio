import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  DEMO_PROFILE,
  MEMBERSHIP_LABELS,
  type MeetoraProfile,
  type MembershipTier,
} from "../data/demoProfile";
import { colors, spacing } from "../theme";

type Props = {
  profile?: MeetoraProfile;
  onEditPress?: () => void;
  onSubscribePress?: () => void;
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("");
}

function formatJoined(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}

function badgeColors(tier: MembershipTier) {
  switch (tier) {
    case "elite":
      return { bg: "rgba(255, 120, 180, 0.18)", fg: "#ff9ec8", border: "rgba(255,120,180,0.45)" };
    case "premium":
      return { bg: colors.accentDim, fg: colors.accent, border: "rgba(62, 207, 142, 0.45)" };
    case "plus":
      return { bg: colors.fixedDim, fg: colors.fixed, border: "rgba(110, 198, 255, 0.4)" };
    default:
      return { bg: "rgba(255,255,255,0.06)", fg: colors.muted, border: colors.line };
  }
}

export function ProfileScreen({
  profile = DEMO_PROFILE,
  onEditPress,
  onSubscribePress,
}: Props) {
  const tier = badgeColors(profile.membership);
  const place = [profile.city, profile.country].filter(Boolean).join(", ");

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <View style={styles.brandRow}>
            <Image
              source={require("../../assets/meetora-logo.jpg")}
              style={styles.logo}
              accessibilityLabel="Logo Meetora"
            />
            <Text style={styles.brand}>Meetora</Text>
          </View>
          <Text style={styles.topHint}>Profil</Text>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroGlow} />
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials(profile.displayName)}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: tier.bg, borderColor: tier.border }]}>
              <Text style={[styles.badgeText, { color: tier.fg }]}>
                {MEMBERSHIP_LABELS[profile.membership]}
              </Text>
            </View>
          </View>

          <Text style={styles.name}>{profile.displayName}</Text>
          <Text style={styles.handle}>{profile.handle}</Text>
          <Text style={styles.bio}>{profile.bio}</Text>

          <View style={styles.metaRow}>
            {!!place && (
              <View style={styles.metaChip}>
                <Text style={styles.metaChipText}>{place}</Text>
              </View>
            )}
            <View style={styles.metaChip}>
              <Text style={styles.metaChipText}>Membre depuis {formatJoined(profile.joinedAt)}</Text>
            </View>
          </View>

          <View style={styles.stats}>
            <Stat value={profile.stats.connections} label="Liens" />
            <Stat value={profile.stats.events} label="Événements" />
            <Stat value={profile.stats.posts} label="Publications" />
          </View>

          <View style={styles.actions}>
            <Pressable
              style={styles.primaryBtn}
              onPress={onEditPress}
              accessibilityRole="button"
              accessibilityLabel="Modifier le profil"
            >
              <Text style={styles.primaryBtnText}>Modifier le profil</Text>
            </Pressable>
            <Pressable
              style={styles.secondaryBtn}
              onPress={onSubscribePress}
              accessibilityRole="button"
            >
              <Text style={styles.secondaryBtnText}>Voir les formules</Text>
            </Pressable>
          </View>
          <Text style={styles.editNote}>
            L’édition complète arrivera ensuite — ce bouton est un aperçu pour la critique.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sur Meetora</Text>
          <Text style={styles.sectionBody}>
            Votre profil est la première impression. Choisissez une durée d’abonnement qui
            correspond à votre rythme — Plus, Premium ou Elite, sans prix figés dans l’app.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.md, paddingBottom: 48 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  logo: { width: 36, height: 36, borderRadius: 10 },
  brand: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.6,
  },
  topHint: { color: colors.muted, fontWeight: "600", fontSize: 13 },
  heroCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.bgCard,
    padding: spacing.lg,
    overflow: "hidden",
    position: "relative",
  },
  heroGlow: {
    position: "absolute",
    top: -80,
    right: -40,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(255, 110, 170, 0.12)",
  },
  avatarWrap: { alignItems: "flex-start", marginBottom: spacing.md },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1e3350",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.18)",
  },
  avatarText: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: 1,
  },
  badge: {
    marginTop: -14,
    marginLeft: 54,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeText: { fontSize: 12, fontWeight: "800", letterSpacing: 0.3 },
  name: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.7,
  },
  handle: { color: colors.muted, marginTop: 2, marginBottom: spacing.sm, fontSize: 15 },
  bio: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: spacing.md,
    opacity: 0.92,
  },
  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: spacing.lg },
  metaChip: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  metaChipText: { color: colors.muted, fontSize: 13, fontWeight: "600" },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: spacing.lg,
  },
  stat: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.22)",
    borderWidth: 1,
    borderColor: colors.line,
  },
  statValue: { color: colors.text, fontSize: 20, fontWeight: "800" },
  statLabel: { color: colors.muted, fontSize: 12, marginTop: 2, fontWeight: "600" },
  actions: { gap: 10 },
  primaryBtn: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryBtnText: { color: "#04150e", fontWeight: "800", fontSize: 16 },
  secondaryBtn: {
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  secondaryBtnText: { color: colors.text, fontWeight: "700", fontSize: 15 },
  editNote: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 10,
    textAlign: "center",
  },
  section: { marginTop: spacing.lg, paddingHorizontal: 4 },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
  },
  sectionBody: { color: colors.muted, fontSize: 14, lineHeight: 21 },
});
