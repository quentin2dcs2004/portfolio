import { useMemo, useState } from "react";
import { Alert, Image, Text, View } from "react-native";
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PhoneShell } from "./src/components/PhoneShell";
import { ThemeProvider, useTheme } from "./src/theme";
import { DiscoverScreen } from "./src/screens/DiscoverScreen";
import { MapScreen } from "./src/screens/MapScreen";
import { LikesScreen } from "./src/screens/LikesScreen";
import { MessagesScreen } from "./src/screens/MessagesScreen";
import { MyProfileTab } from "./src/screens/MyProfileTab";
import { SubscribeScreen } from "./src/screens/SubscribeScreen";
import { AccountScreen } from "./src/screens/AccountScreen";
import { CrushNoteScreen } from "./src/screens/CrushNoteScreen";
import { SeasonalFormScreen } from "./src/screens/SeasonalFormScreen";
import { PassionQuizScreen } from "./src/screens/PassionQuizScreen";

export type RootStackParamList = {
  Tabs: undefined;
  Subscribe: undefined;
  Account: { email?: string } | undefined;
  CrushNotes: undefined;
  SeasonalForm: undefined;
  PassionQuiz: undefined;
};

export type MainTabParamList = {
  Decouvrir: undefined;
  Carte: undefined;
  Likes: undefined;
  Messages: undefined;
  Profil: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function TabIcon({ label, focused, color }: { label: string; focused: boolean; color: string }) {
  const map: Record<string, string> = {
    Decouvrir: "◎",
    Carte: "⌖",
    Likes: "♥",
    Messages: "✉",
    Profil: "☺",
  };
  return (
    <Text style={{ color, fontSize: focused ? 18 : 16, fontWeight: focused ? "800" : "600" }}>
      {map[label] || "•"}
    </Text>
  );
}

function MainTabs({
  openCrush,
  openSubscribe,
  openSeasonal,
  openQuiz,
}: {
  openCrush: () => void;
  openSubscribe: () => void;
  openSeasonal: () => void;
  openQuiz: () => void;
}) {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="Carte"
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colors.bgElevated },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        headerTitle: () => (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Image
              source={require("./assets/meetora-logo.jpg")}
              style={{ width: 24, height: 24, borderRadius: 6 }}
            />
            <Text style={{ color: colors.text, fontWeight: "800", fontSize: 16 }}>Meetora</Text>
          </View>
        ),
        tabBarStyle: {
          backgroundColor: colors.bgElevated,
          borderTopColor: colors.line,
          height: 58,
          paddingBottom: 6,
          paddingTop: 6,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 10, fontWeight: "700" },
        tabBarIcon: ({ color, focused }) => (
          <TabIcon label={route.name} focused={focused} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Decouvrir" options={{ title: "Découvrir", tabBarLabel: "Découvrir" }}>
        {() => <DiscoverScreen onCrushNote={() => openCrush()} />}
      </Tab.Screen>
      <Tab.Screen name="Carte" options={{ title: "Carte", tabBarLabel: "Carte" }}>
        {() => (
          <MapScreen
            onOpenCrush={() => openCrush()}
            onLike={() => Alert.alert("Like", "Like enregistré (démo).")}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Likes" options={{ tabBarLabel: "Likes" }}>
        {() => <LikesScreen onOpenCrush={openCrush} />}
      </Tab.Screen>
      <Tab.Screen name="Messages" options={{ tabBarLabel: "Messages" }}>
        {() => (
          <MessagesScreen
            onCrushNotes={openCrush}
            onOpenThread={(name) => Alert.alert(name, "Fil de discussion (démo).")}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Profil" options={{ tabBarLabel: "Profil" }}>
        {() => (
          <MyProfileTab
            onSubscribe={openSubscribe}
            onSeasonal={openSeasonal}
            onQuiz={openQuiz}
            onCrushNotes={openCrush}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { colors, mode } = useTheme();
  const [accountEmail, setAccountEmail] = useState("");

  const navTheme = useMemo(() => {
    const base = mode === "dark" ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        background: colors.bg,
        card: colors.bgElevated,
        text: colors.text,
        border: colors.line,
        primary: colors.accent,
      },
    };
  }, [colors, mode]);

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.bgElevated },
          headerTintColor: colors.text,
          contentStyle: { backgroundColor: colors.bg },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="Tabs" options={{ headerShown: false }}>
          {({ navigation }) => (
            <MainTabs
              openCrush={() => navigation.navigate("CrushNotes")}
              openSubscribe={() => navigation.navigate("Subscribe")}
              openSeasonal={() => navigation.navigate("SeasonalForm")}
              openQuiz={() => navigation.navigate("PassionQuiz")}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="CrushNotes" options={{ title: "CrushNotes", presentation: "modal" }}>
          {({ navigation }) => <CrushNoteScreen onDone={() => navigation.goBack()} />}
        </Stack.Screen>
        <Stack.Screen name="SeasonalForm" options={{ title: "Formulaire du mois" }}>
          {({ navigation }) => <SeasonalFormScreen onDone={() => navigation.goBack()} />}
        </Stack.Screen>
        <Stack.Screen name="PassionQuiz" options={{ title: "Quiz musique" }}>
          {({ navigation }) => <PassionQuizScreen onDone={() => navigation.goBack()} />}
        </Stack.Screen>
        <Stack.Screen name="Subscribe" options={{ title: "Formules" }}>
          {({ navigation }) => (
            <SubscribeScreen
              onSubscribed={(email) => {
                setAccountEmail(email);
                navigation.navigate("Account", { email });
              }}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Account" options={{ title: "Compte" }}>
          {({ route }) => <AccountScreen initialEmail={route.params?.email || accountEmail} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PhoneShell>
        <SafeAreaProvider>
          <AppNavigator />
        </SafeAreaProvider>
      </PhoneShell>
    </ThemeProvider>
  );
}
