import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CROSSED_PINS, LYON_CENTER, type CrossedPin } from "../data/crossedPaths";
import { intentionById } from "../data/intentions";
import { useTheme } from "../theme";

type Props = {
  onOpenCrush?: (pin: CrossedPin) => void;
  onLike?: (pin: CrossedPin) => void;
};

declare global {
  interface Window {
    L?: any;
  }
}

function loadLeaflet(): Promise<any> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.L) return Promise.resolve(window.L);
  return new Promise((resolve, reject) => {
    const cssId = "leaflet-css";
    if (!document.getElementById(cssId)) {
      const link = document.createElement("link");
      link.id = cssId;
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    const existing = document.getElementById("leaflet-js") as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve(window.L));
      return;
    }
    const script = document.createElement("script");
    script.id = "leaflet-js";
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.onload = () => resolve(window.L);
    script.onerror = () => reject(new Error("Leaflet load failed"));
    document.body.appendChild(script);
  });
}

export function MapScreen({ onOpenCrush, onLike }: Props) {
  const { colors } = useTheme();
  const mapRef = useRef<any>(null);
  const [selected, setSelected] = useState<CrossedPin | null>(null);
  const [ready, setReady] = useState(Platform.OS !== "web");
  const styles = make(colors);

  useEffect(() => {
    if (Platform.OS !== "web") return;
    let cancelled = false;
    let map: any;

    (async () => {
      try {
        const L = await loadLeaflet();
        if (cancelled) return;
        const node = document.getElementById("meetora-map");
        if (!node) return;

        map = L.map(node, {
          zoomControl: false,
          attributionControl: true,
        }).setView([LYON_CENTER.lat, LYON_CENTER.lng], 14);

        // Free OSM tiles (no API key). Dark filter via CSS on container.
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: "&copy; OpenStreetMap",
        }).addTo(map);
        node.style.filter = "invert(1) hue-rotate(180deg) brightness(0.9) contrast(0.9)";

        CROSSED_PINS.forEach((pin) => {
          const icon = L.divIcon({
            className: "meetora-pin",
            html: `<div style="
              width:44px;height:44px;border-radius:22px;overflow:hidden;
              border:3px solid #ff6b9d;box-shadow:0 4px 14px rgba(0,0,0,.45);
              background:#222;">
              <img src="${pin.photos[0]}" style="width:100%;height:100%;object-fit:cover" />
            </div>`,
            iconSize: [44, 44],
            iconAnchor: [22, 22],
          });
          const marker = L.marker([pin.lat, pin.lng], { icon }).addTo(map);
          marker.on("click", () => setSelected(pin));
        });

        // You are here
        L.circleMarker([LYON_CENTER.lat, LYON_CENTER.lng], {
          radius: 8,
          color: "#5ec8ff",
          fillColor: "#5ec8ff",
          fillOpacity: 0.9,
          weight: 2,
        }).addTo(map);

        mapRef.current = map;
        setReady(true);
        setTimeout(() => map.invalidateSize(), 80);
      } catch {
        setReady(true);
      }
    })();

    return () => {
      cancelled = true;
      if (map) map.remove();
    };
  }, []);

  return (
    <View style={styles.root}>
      <View style={styles.mapWrap}>
        {Platform.OS === "web" ? (
          <View style={{ flex: 1, minHeight: 400 }}>
            {React.createElement("div", {
              id: "meetora-map",
              style: { width: "100%", height: "100%", minHeight: 400 },
            })}
          </View>
        ) : (
          <FallbackMap colors={colors} onSelect={setSelected} />
        )}
        {!ready && (
          <View style={styles.loading}>
            <Text style={styles.loadingText}>Chargement de la carte…</Text>
          </View>
        )}
        <View style={styles.banner} pointerEvents="none">
          <Text style={styles.bannerTitle}>Chemins croisés · Lyon</Text>
          <Text style={styles.bannerSub}>{CROSSED_PINS.length} personnes croisées près de toi</Text>
        </View>
      </View>

      {selected && (
        <View style={styles.sheet}>
          <Pressable style={styles.sheetClose} onPress={() => setSelected(null)}>
            <Text style={styles.sheetCloseText}>Fermer</Text>
          </Pressable>
          <View style={styles.sheetRow}>
            <Image source={{ uri: selected.photos[0] }} style={styles.sheetAvatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.sheetName}>
                {selected.displayName}, {selected.age}
              </Text>
              <Text style={styles.sheetDist}>{selected.distanceLabel}</Text>
              <Text style={styles.sheetWhen}>{selected.crossedAt}</Text>
            </View>
          </View>
          <View style={styles.intentions}>
            {selected.intentionIds.map((id) => {
              const it = intentionById(id);
              return it ? (
                <Text key={id} style={styles.intention}>
                  {it.emoji} {it.label}
                </Text>
              ) : null;
            })}
          </View>
          <Text style={styles.sheetBio} numberOfLines={2}>
            {selected.bio}
          </Text>
          <View style={styles.sheetActions}>
            <Pressable
              style={[styles.action, styles.pass]}
              onPress={() => setSelected(null)}
            >
              <Text style={styles.passText}>✕</Text>
            </Pressable>
            <Pressable
              style={[styles.action, styles.crush]}
              onPress={() => onOpenCrush?.(selected)}
            >
              <Text style={styles.crushText}>✉</Text>
            </Pressable>
            <Pressable
              style={[styles.action, styles.like]}
              onPress={() => {
                onLike?.(selected);
                setSelected(null);
              }}
            >
              <Text style={styles.likeText}>♥</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

function FallbackMap({
  onSelect,
  colors,
}: {
  onSelect: (p: CrossedPin) => void;
  colors: ReturnType<typeof useTheme>["colors"];
}) {
  // Rough pin layout if native / no Leaflet
  return (
    <View style={{ flex: 1, backgroundColor: "#1a2330" }}>
      <Image
        source={{
          uri: "https://a.basemaps.cartocdn.com/dark_all/14/8424/5902.png",
        }}
        style={StyleSheet.absoluteFill as any}
        resizeMode="cover"
      />
      {CROSSED_PINS.map((pin, i) => (
        <Pressable
          key={pin.id}
          onPress={() => onSelect(pin)}
          style={{
            position: "absolute",
            left: 40 + (i % 3) * 100,
            top: 120 + Math.floor(i / 3) * 140,
          }}
        >
          <Image
            source={{ uri: pin.photos[0] }}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              borderWidth: 3,
              borderColor: colors.accent,
            }}
          />
        </Pressable>
      ))}
    </View>
  );
}

function make(colors: ReturnType<typeof useTheme>["colors"]) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.bg },
    mapWrap: { flex: 1, overflow: "hidden" },
    loading: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0,0,0,0.35)",
      zIndex: 5,
    },
    loadingText: { color: "#fff", fontWeight: "700" },
    banner: {
      position: "absolute",
      top: 12,
      left: 12,
      right: 12,
      zIndex: 6,
      backgroundColor: "rgba(10,12,18,0.82)",
      borderRadius: 14,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.line,
    },
    bannerTitle: { color: "#fff", fontWeight: "800", fontSize: 15 },
    bannerSub: { color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 2 },
    sheet: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 20,
      backgroundColor: colors.bgElevated,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 16,
      paddingBottom: 20,
      borderTopWidth: 1,
      borderColor: colors.line,
    },
    sheetClose: { alignSelf: "flex-end", marginBottom: 6 },
    sheetCloseText: { color: colors.muted, fontWeight: "700" },
    sheetRow: { flexDirection: "row", gap: 12, alignItems: "center" },
    sheetAvatar: { width: 64, height: 64, borderRadius: 32 },
    sheetName: { color: colors.text, fontWeight: "800", fontSize: 20 },
    sheetDist: { color: colors.accent, fontWeight: "700", marginTop: 2 },
    sheetWhen: { color: colors.muted, fontSize: 12, marginTop: 2 },
    intentions: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 10 },
    intention: {
      color: colors.text,
      backgroundColor: colors.bgCard,
      borderRadius: 999,
      overflow: "hidden",
      paddingHorizontal: 10,
      paddingVertical: 5,
      fontSize: 12,
      fontWeight: "700",
      borderWidth: 1,
      borderColor: colors.line,
    },
    sheetBio: { color: colors.muted, marginTop: 10, lineHeight: 19 },
    sheetActions: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 18,
      marginTop: 14,
    },
    action: {
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
    },
    pass: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: colors.bg,
      borderColor: colors.line,
    },
    passText: { color: colors.danger, fontSize: 20, fontWeight: "700" },
    crush: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: colors.crushDim,
      borderColor: colors.crush,
    },
    crushText: { color: colors.crush, fontSize: 18, fontWeight: "700" },
    like: {
      width: 58,
      height: 58,
      borderRadius: 29,
      backgroundColor: colors.like,
      borderColor: colors.like,
    },
    likeText: { color: "#fff", fontSize: 24, fontWeight: "700" },
  });
}
