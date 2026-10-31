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
import { FEED_PROFILES } from "../data/feedProfiles";
import { intentionById } from "../data/intentions";
import { MEMBERSHIP_LABELS, type MeetoraProfile } from "../data/demoProfile";
import { useTheme } from "../theme";

type Props = {
  onCrushNote?: (profile: MeetoraProfile) => void;
  onEmpty?: () => void;
};

export function DiscoverScreen({ onCrushNote, onEmpty }: Props) {
  const { colors } = useTheme();
  const [queue, setQueue] = useState(FEED_PROFILES);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [width, setWidth] = useState(390);
  const [height, setHeight] = useState(640);
  const scroller = useRef<any>(null);
  const styles = make(colors);

  const current = queue[0];

  function advance() {
    setPhotoIndex(0);
    setQueue((q) => {
      const next = q.slice(1);
      if (!next.length) onEmpty?.();
      return next;
    });
  }

  function onHeroScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    if (!current) return;
    const x = e.nativeEvent.contentOffset.x;
    const i = Math.round(x / Math.max(width, 1));
    if (i !== photoIndex && i >= 0 && i < current.photos.length) setPhotoIndex(i);
  }

  function goPhoto(dir: -1 | 1) {
    if (!current) return;
    const next = Math.max(0, Math.min(current.photos.length - 1, photoIndex + dir));
    setPhotoIndex(next);
    scroller.current?.scrollTo?.({ x: next * width, animated: true });
  }

  if (!current) {
    return (
      <View style={[styles.root, styles.empty]}>
        <Text style={styles.emptyTitle}>Plus de croisés pour l’instant</Text>
        <Text style={styles.emptySub}>Reviens plus tard — de nouveaux chemins croisés apparaissent ici.</Text>
        <Pressable
          style={styles.reload}
          onPress={() => {
            setQueue(FEED_PROFILES);
            setPhotoIndex(0);
          }}
        >
          <Text style={styles.reloadText}>Réafficher la démo</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View
        style={styles.card}
        onLayout={(e) => {
          setWidth(e.nativeEvent.layout.width);
          setHeight(e.nativeEvent.layout.height);
        }}
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
          {current.photos.map((uri, i) => (
            <Image
              key={`${current.id}-${i}`}
              source={{ uri }}
              style={{ width, height }}
              resizeMode="cover"
            />
          ))}
        </ScrollView>

        <View style={styles.tapRow} pointerEvents="box-none">
          <Pressable style={styles.tapHalf} onPress={() => goPhoto(-1)} />
          <Pressable style={styles.tapHalf} onPress={() => goPhoto(1)} />
        </View>

        <View style={styles.progressRow}>
          {current.photos.map((_, i) => (
            <View key={i} style={[styles.progressSeg, i === photoIndex && styles.progressSegOn]} />
          ))}
        </View>

        <View style={styles.topChrome} pointerEvents="none">
          <Text style={styles.crossedHint}>Chemins croisés</Text>
        </View>

        <View style={styles.scrim} pointerEvents="none">
          <View style={{ flex: 1 }} />
          <View style={{ height: 90, backgroundColor: "rgba(5,6,12,0.35)" }} />
          <View style={{ height: 150, backgroundColor: colors.heroScrim }} />
        </View>

        <View style={styles.meta} pointerEvents="box-none">
          {current.membership !== "free" && (
            <View style={styles.memberBadge}>
              <Text style={styles.memberBadgeText}>{MEMBERSHIP_LABELS[current.membership]}</Text>
            </View>
          )}
          <Text style={styles.distance}>{current.distanceLabel}</Text>
          <Text style={styles.nameAge}>
            {current.displayName}
            <Text style={styles.age}>  {current.age}</Text>
          </Text>
          <View style={styles.intentionRow}>
            {current.intentionIds.map((id) => {
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
          <Text style={styles.bio} numberOfLines={2}>
            {current.bio}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable style={[styles.btn, styles.pass]} onPress={advance} accessibilityLabel="Passer">
          <Text style={styles.passText}>✕</Text>
        </Pressable>
        <Pressable
          style={[styles.btn, styles.crush]}
          onPress={() => onCrushNote?.(current)}
          accessibilityLabel="CrushNote"
        >
          <Text style={styles.crushText}>✉</Text>
        </Pressable>
        <Pressable style={[styles.btn, styles.like]} onPress={advance} accessibilityLabel="Like">
          <Text style={styles.likeText}>♥</Text>
        </Pressable>
      </View>
    </View>
  );
}

function make(colors: ReturnType<typeof useTheme>["colors"]) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.bg, paddingBottom: 8 },
    card: {
      flex: 1,
      marginHorizontal: 10,
      marginTop: 8,
      borderRadius: 22,
      overflow: "hidden",
      backgroundColor: "#111",
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
      top: 12,
      left: 12,
      right: 12,
      zIndex: 4,
      flexDirection: "row",
      gap: 4,
    },
    progressSeg: { flex: 1, height: 3, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.35)" },
    progressSegOn: { backgroundColor: "#fff" },
    topChrome: { position: "absolute", top: 22, left: 0, right: 0, alignItems: "center", zIndex: 4 },
    crossedHint: {
      color: "#fff",
      fontWeight: "800",
      fontSize: 13,
      letterSpacing: 0.6,
      textTransform: "uppercase",
      textShadowColor: "rgba(0,0,0,0.5)",
      textShadowRadius: 6,
    },
    scrim: { position: "absolute", left: 0, right: 0, bottom: 0, height: 260, zIndex: 3 },
    meta: { position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 5, padding: 16, paddingBottom: 20 },
    memberBadge: {
      alignSelf: "flex-start",
      backgroundColor: colors.accentDim,
      borderColor: colors.accent,
      borderWidth: 1,
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 4,
      marginBottom: 8,
    },
    memberBadgeText: { color: colors.accent, fontWeight: "800", fontSize: 11 },
    distance: { color: "rgba(255,255,255,0.9)", fontWeight: "700", fontSize: 13, marginBottom: 4 },
    nameAge: { color: "#fff", fontSize: 34, fontWeight: "800", letterSpacing: -0.8 },
    age: { fontWeight: "600", fontSize: 30, color: "rgba(255,255,255,0.92)" },
    intentionRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 },
    intentionPill: {
      backgroundColor: "rgba(255,255,255,0.16)",
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    intentionPillText: { color: "#fff", fontWeight: "700", fontSize: 12 },
    bio: { color: "rgba(255,255,255,0.85)", marginTop: 8, fontSize: 14, lineHeight: 20 },
    actions: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 22,
      paddingVertical: 14,
    },
    btn: {
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      shadowColor: "#000",
      shadowOpacity: 0.3,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
    },
    pass: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.bgElevated,
      borderColor: colors.line,
    },
    passText: { color: colors.danger, fontSize: 24, fontWeight: "700" },
    crush: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: colors.crushDim,
      borderColor: colors.crush,
    },
    crushText: { color: colors.crush, fontSize: 20, fontWeight: "700" },
    like: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.like,
      borderColor: colors.like,
    },
    likeText: { color: "#fff", fontSize: 28, fontWeight: "700" },
    empty: { alignItems: "center", justifyContent: "center", padding: 24 },
    emptyTitle: { color: colors.text, fontSize: 20, fontWeight: "800", textAlign: "center" },
    emptySub: { color: colors.muted, textAlign: "center", marginTop: 8, lineHeight: 20 },
    reload: {
      marginTop: 18,
      backgroundColor: colors.accent,
      borderRadius: 14,
      paddingHorizontal: 18,
      paddingVertical: 12,
    },
    reloadText: { color: "#1a0a12", fontWeight: "800" },
  });
}
