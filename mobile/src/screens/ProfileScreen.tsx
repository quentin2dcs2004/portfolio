import { useRef, useState } from "react";
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  DEMO_PROFILE,
  MEMBERSHIP_LABELS,
  type MeetoraProfile,
} from "../data/demoProfile";
import { colors, spacing } from "../theme";

type Props = {
  profile?: MeetoraProfile;
  onEditPress?: () => void;
  onSubscribePress?: () => void;
};

/** Fixed hero height for phone frame (~390×844), Happn-like. */
const HERO_HEIGHT = 520;

export function ProfileScreen({
  profile = DEMO_PROFILE,
  onEditPress,
  onSubscribePress,
}: Props) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [heroWidth, setHeroWidth] = useState(390);
  // RN 0.88 ScrollView ref typing is awkward on web; keep imperative scrollTo.
  const scroller = useRef<any>(null);

  function onHeroScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const x = e.nativeEvent.contentOffset.x;
    const i = Math.round(x / Math.max(heroWidth, 1));
    if (i !== photoIndex && i >= 0 && i < profile.photos.length) setPhotoIndex(i);
  }

  function goPhoto(dir: -1 | 1) {
    const next = Math.max(0, Math.min(profile.photos.length - 1, photoIndex + dir));
    setPhotoIndex(next);
    scroller.current?.scrollTo?.({ x: next * heroWidth, animated: true });
  }

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.page}
        contentContainerStyle={styles.pageContent}
        showsVerticalScrollIndicator={false}
        bounces
      >
        {/* Happn-style full-bleed photo carousel */}
        <View
          style={[styles.hero, { height: HERO_HEIGHT }]}
          onLayout={(e) => setHeroWidth(e.nativeEvent.layout.width)}
        >
          <ScrollView
            ref={scroller}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onHeroScroll}
            scrollEventThrottle={16}
            style={StyleSheet.absoluteFill}
          >
            {profile.photos.map((uri, i) => (
              <Image
                key={`${uri}-${i}`}
                source={{ uri }}
                style={{ width: heroWidth, height: HERO_HEIGHT }}
                resizeMode="cover"
                accessibilityLabel={`Photo ${i + 1} de ${profile.displayName}`}
              />
            ))}
          </ScrollView>

          {/* Tap zones left/right like Happn */}
          <View style={styles.tapRow} pointerEvents="box-none">
            <Pressable style={styles.tapHalf} onPress={() => goPhoto(-1)} />
            <Pressable style={styles.tapHalf} onPress={() => goPhoto(1)} />
          </View>

          <View style={styles.progressRow}>
            {profile.photos.map((_, i) => (
              <View key={i} style={[styles.progressSeg, i === photoIndex && styles.progressSegOn]} />
            ))}
          </View>

          <View style={styles.heroScrim} pointerEvents="none">
            <View style={styles.scrimTop} />
            <View style={styles.scrimMid} />
            <View style={styles.scrimBot} />
          </View>

          <View style={styles.heroMeta} pointerEvents="box-none">
            <View style={styles.badgeRow}>
              <View style={styles.memberBadge}>
                <Text style={styles.memberBadgeText}>
                  {MEMBERSHIP_LABELS[profile.membership]}
                </Text>
              </View>
              <Text style={styles.distance}>{profile.distanceLabel}</Text>
            </View>
            <Text style={styles.nameAge}>
              {profile.displayName}
              <Text style={styles.age}>  {profile.age}</Text>
            </Text>
            <Text style={styles.cityLine}>
              {profile.city}
              {profile.country ? `, ${profile.country}` : ""}
            </Text>
          </View>
        </View>

        <View style={styles.sheet}>
          <Text style={styles.sectionLabel}>À propos</Text>
          <Text style={styles.bio}>{profile.bio}</Text>

          <Text style={[styles.sectionLabel, { marginTop: spacing.md }]}>Centres d’intérêt</Text>
          <View style={styles.tags}>
            {profile.interests.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          <Pressable style={styles.editLink} onPress={onEditPress}>
            <Text style={styles.editLinkText}>Modifier mon profil</Text>
          </Pressable>
          <Pressable onPress={onSubscribePress}>
            <Text style={styles.subscribeLink}>Voir les formules Meetora</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Compact Happn-like action dock */}
      <View style={styles.actions}>
        <Pressable
          style={[styles.actionBtn, styles.actionPass]}
          onPress={onEditPress}
          accessibilityLabel="Passer"
        >
          <Text style={styles.actionPassText}>✕</Text>
        </Pressable>
        <Pressable
          style={[styles.actionBtn, styles.actionStar]}
          onPress={onSubscribePress}
          accessibilityLabel="Favori Meetora"
        >
          <Text style={styles.actionStarText}>★</Text>
        </Pressable>
        <Pressable
          style={[styles.actionBtn, styles.actionLike]}
          onPress={onSubscribePress}
          accessibilityLabel="Like"
        >
          <Text style={styles.actionLikeText}>♥</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  page: { flex: 1 },
  pageContent: { paddingBottom: 108 },
  hero: {
    width: "100%",
    backgroundColor: "#111",
    overflow: "hidden",
  },
  tapRow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    zIndex: 2,
  },
  tapHalf: { flex: 1 },
  progressRow: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    zIndex: 4,
    flexDirection: "row",
    gap: 4,
  },
  progressSeg: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  progressSegOn: { backgroundColor: "#fff" },
  heroScrim: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 220,
    zIndex: 3,
    justifyContent: "flex-end",
  },
  scrimTop: { flex: 1, backgroundColor: "rgba(5,8,7,0.05)" },
  scrimMid: { height: 70, backgroundColor: "rgba(5,8,7,0.35)" },
  scrimBot: { height: 100, backgroundColor: "rgba(5,8,7,0.72)" },
  heroMeta: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  memberBadge: {
    backgroundColor: "rgba(62, 207, 142, 0.22)",
    borderColor: "rgba(62, 207, 142, 0.55)",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  memberBadgeText: {
    color: colors.accent,
    fontWeight: "800",
    fontSize: 11,
    letterSpacing: 0.3,
  },
  distance: { color: "rgba(255,255,255,0.85)", fontWeight: "600", fontSize: 13 },
  nameAge: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -0.8,
  },
  age: { fontWeight: "600", fontSize: 28, color: "rgba(255,255,255,0.92)" },
  cityLine: { color: "rgba(255,255,255,0.8)", marginTop: 4, fontSize: 14, fontWeight: "600" },
  sheet: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  sectionLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  bio: { color: colors.text, fontSize: 16, lineHeight: 23 },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: colors.line,
  },
  tagText: { color: colors.text, fontWeight: "600", fontSize: 13 },
  editLink: { marginTop: spacing.lg, marginBottom: 8 },
  editLinkText: { color: colors.accent, fontWeight: "700", fontSize: 15 },
  subscribeLink: { color: colors.muted, fontWeight: "600", fontSize: 13, marginBottom: 8 },
  actions: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 18,
    zIndex: 10,
  },
  actionBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  actionPass: {
    backgroundColor: colors.bgElevated,
    borderColor: colors.line,
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  actionPassText: { color: colors.danger, fontSize: 22, fontWeight: "700" },
  actionStar: {
    backgroundColor: colors.bgElevated,
    borderColor: "rgba(240, 198, 116, 0.45)",
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  actionStarText: { color: colors.warn, fontSize: 22 },
  actionLike: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  actionLikeText: { color: "#04150e", fontSize: 26, fontWeight: "700" },
});
