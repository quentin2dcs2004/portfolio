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
import { DEMO_PROFILE, MEMBERSHIP_LABELS, type MeetoraProfile } from "../data/demoProfile";
import { INTENTIONS, intentionById } from "../data/intentions";
import { useTheme } from "../theme";

type Props = {
  profile?: MeetoraProfile;
  onEditPress?: () => void;
  onSubscribePress?: () => void;
  onCrushNote?: () => void;
  onIntentionsChange?: (ids: string[]) => void;
};

const HERO_HEIGHT = 480;

export function ProfileScreen({
  profile = DEMO_PROFILE,
  onEditPress,
  onSubscribePress,
  onCrushNote,
}: Props) {
  const { colors } = useTheme();
  const [photoIndex, setPhotoIndex] = useState(0);
  const [heroWidth, setHeroWidth] = useState(390);
  const [intentionIds, setIntentionIds] = useState(profile.intentionIds);
  const scroller = useRef<any>(null);
  const styles = make(colors);

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

  function toggleIntention(id: string) {
    setIntentionIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return [...prev.slice(1), id];
      return [...prev, id];
    });
  }

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.pageContent} showsVerticalScrollIndicator={false}>
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
              />
            ))}
          </ScrollView>
          <View style={styles.tapRow} pointerEvents="box-none">
            <Pressable style={styles.tapHalf} onPress={() => goPhoto(-1)} />
            <Pressable style={styles.tapHalf} onPress={() => goPhoto(1)} />
          </View>
          <View style={styles.progressRow}>
            {profile.photos.map((_, i) => (
              <View key={i} style={[styles.progressSeg, i === photoIndex && styles.progressSegOn]} />
            ))}
          </View>
          <View style={styles.heroScrim}>
            <View style={{ flex: 1 }} />
            <View style={{ height: 80, backgroundColor: "rgba(5,6,12,0.4)" }} />
            <View style={{ height: 110, backgroundColor: colors.heroScrim }} />
          </View>
          <View style={styles.heroMeta}>
            <View style={styles.badgeRow}>
              <View style={styles.memberBadge}>
                <Text style={styles.memberBadgeText}>{MEMBERSHIP_LABELS[profile.membership]}</Text>
              </View>
              <Text style={styles.distance}>{profile.distanceLabel}</Text>
            </View>
            <Text style={styles.nameAge}>
              {profile.displayName}
              <Text style={styles.age}>  {profile.age}</Text>
            </Text>
            <View style={styles.intentionRow}>
              {intentionIds.map((id) => {
                const it = intentionById(id);
                if (!it) return null;
                return (
                  <View key={id} style={styles.intentionPill}>
                    <Text style={styles.intentionPillText}>
                      {it.emoji} {it.label}
                    </Text>
                  </View>
                );
              })}
            </View>
            <Text style={styles.cityLine}>
              {profile.city}, {profile.country}
            </Text>
          </View>
        </View>

        <View style={styles.sheet}>
          <Text style={styles.sectionLabel}>À propos</Text>
          <Text style={styles.bio}>{profile.bio}</Text>

          <Text style={[styles.sectionLabel, { marginTop: 16 }]}>Intentions</Text>
          <Text style={styles.hint}>Choisis jusqu’à 3 — style Fruitz, plus classe.</Text>
          <View style={styles.tags}>
            {INTENTIONS.map((it) => {
              const on = intentionIds.includes(it.id);
              return (
                <Pressable
                  key={it.id}
                  onPress={() => toggleIntention(it.id)}
                  style={[styles.tag, on && styles.tagOn]}
                >
                  <Text style={[styles.tagText, on && styles.tagTextOn]}>
                    {it.emoji} {it.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={[styles.sectionLabel, { marginTop: 16 }]}>Centres d’intérêt</Text>
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

      <View style={styles.actions}>
        <Pressable style={[styles.actionBtn, styles.actionPass]} onPress={onEditPress}>
          <Text style={styles.actionPassText}>✕</Text>
        </Pressable>
        <Pressable style={[styles.actionBtn, styles.actionStar]} onPress={onCrushNote}>
          <Text style={styles.actionStarText}>✉</Text>
        </Pressable>
        <Pressable style={[styles.actionBtn, styles.actionLike]} onPress={onCrushNote}>
          <Text style={styles.actionLikeText}>♥</Text>
        </Pressable>
      </View>
    </View>
  );
}

function make(colors: ReturnType<typeof useTheme>["colors"]) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.bg },
    pageContent: { paddingBottom: 108 },
    hero: { width: "100%", backgroundColor: "#111", overflow: "hidden" },
    tapRow: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, flexDirection: "row", zIndex: 2 },
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
    progressSeg: { flex: 1, height: 3, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.35)" },
    progressSegOn: { backgroundColor: "#fff" },
    heroScrim: { position: "absolute", left: 0, right: 0, bottom: 0, height: 220, zIndex: 3 },
    heroMeta: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 5,
      paddingHorizontal: 16,
      paddingBottom: 18,
    },
    badgeRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
    memberBadge: {
      backgroundColor: colors.accentDim,
      borderColor: colors.accent,
      borderWidth: 1,
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    memberBadgeText: { color: colors.accent, fontWeight: "800", fontSize: 11 },
    distance: { color: "rgba(255,255,255,0.85)", fontWeight: "600", fontSize: 13 },
    nameAge: { color: "#fff", fontSize: 32, fontWeight: "800", letterSpacing: -0.8 },
    age: { fontWeight: "600", fontSize: 28, color: "rgba(255,255,255,0.92)" },
    intentionRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 },
    intentionPill: {
      backgroundColor: "rgba(255,255,255,0.16)",
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    intentionPillText: { color: "#fff", fontWeight: "700", fontSize: 12 },
    cityLine: { color: "rgba(255,255,255,0.8)", marginTop: 6, fontSize: 14, fontWeight: "600" },
    sheet: { paddingHorizontal: 16, paddingTop: 16 },
    sectionLabel: {
      color: colors.muted,
      fontSize: 12,
      fontWeight: "800",
      letterSpacing: 0.5,
      textTransform: "uppercase",
      marginBottom: 8,
    },
    hint: { color: colors.muted, fontSize: 12, marginBottom: 8, marginTop: -4 },
    bio: { color: colors.text, fontSize: 16, lineHeight: 23 },
    tags: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    tag: {
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: colors.bgElevated,
      borderWidth: 1,
      borderColor: colors.line,
    },
    tagOn: { backgroundColor: colors.accentDim, borderColor: colors.accent },
    tagText: { color: colors.text, fontWeight: "600", fontSize: 13 },
    tagTextOn: { color: colors.accent },
    editLink: { marginTop: 18, marginBottom: 8 },
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
      backgroundColor: colors.crushDim,
      borderColor: colors.crush,
      width: 52,
      height: 52,
      borderRadius: 26,
    },
    actionStarText: { color: colors.crush, fontSize: 20, fontWeight: "700" },
    actionLike: {
      backgroundColor: colors.like,
      borderColor: colors.like,
      width: 64,
      height: 64,
      borderRadius: 32,
    },
    actionLikeText: { color: "#fff", fontSize: 26, fontWeight: "700" },
  });
}
