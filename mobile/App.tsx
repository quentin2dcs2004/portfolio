import { useMemo, useState } from "react";
import { Alert, Image, Pressable, Text, View } from "react-native";
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PhoneShell } from "./src/components/PhoneShell";
import { ThemeProvider, useTheme } from "./src/theme";
import { ExploreScreen } from "./src/screens/ExploreScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { SubscribeScreen } from "./src/screens/SubscribeScreen";
import { AccountScreen } from "./src/screens/AccountScreen";
import { CrushNoteScreen } from "./src/screens/CrushNoteScreen";
import { SeasonalFormScreen } from "./src/screens/SeasonalFormScreen";
import { PassionQuizScreen } from "./src/screens/PassionQuizScreen";

function MeetoraHeaderTitle() {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <Image
        source={require("./assets/meetora-logo.jpg")}
        style={{ width: 26, height: 26, borderRadius: 7 }}
        accessibilityLabel="Meetora"
      />
      <Text style={{ color: colors.text, fontWeight: "800", fontSize: 16 }}>Meetora</Text>
    </View>
  );
}

export type RootStackParamList = {
  Explore: undefined;
  Profile: undefined;
  Subscribe: undefined;
  Account: { email?: string } | undefined;
  CrushNotes: undefined;
  SeasonalForm: undefined;
  PassionQuiz: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  const { colors, mode, toggle } = useTheme();
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
      <StatusBar style={mode === "dark" ? "light" : "dark" } />
      <Stack.Navigator
        initialRouteName="Explore"
        screenOptions={{
          headerStyle: { backgroundColor: colors.bgElevated },
          headerTintColor: colors.text,
          contentStyle: { backgroundColor: colors.bg },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="Explore"
          options={{
            headerTitle: () => <MeetoraHeaderTitle />,
            headerRight: () => (
              <Pressable onPress={toggle} hitSlop={12} style={{ padding: 6 }}>
                <Text style={{ color: colors.accent, fontWeight: "700" }}>
                  {mode === "dark" ? "Clair" : "Sombre"}
                </Text>
              </Pressable>
            ),
          }}
        >
          {({ navigation }) => (
            <ExploreScreen
              onCrushNotes={() => navigation.navigate("CrushNotes")}
              onSeasonal={() => navigation.navigate("SeasonalForm")}
              onQuiz={() => navigation.navigate("PassionQuiz")}
              onSubscribe={() => navigation.navigate("Subscribe")}
              onProfile={() => navigation.navigate("Profile")}
            />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="Profile"
          options={({ navigation }) => ({
            headerTitle: () => <MeetoraHeaderTitle />,
            headerRight: () => (
              <Pressable onPress={() => navigation.navigate("Explore")} hitSlop={12}>
                <Text style={{ color: colors.accent, fontWeight: "700" }}>Menu</Text>
              </Pressable>
            ),
          })}
        >
          {({ navigation }) => (
            <ProfileScreen
              onEditPress={() =>
                Alert.alert("Modifier le profil", "Placeholder — bientôt photo, bio, ville.")
              }
              onSubscribePress={() => navigation.navigate("Subscribe")}
              onCrushNote={() => navigation.navigate("CrushNotes")}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="CrushNotes" options={{ title: "CrushNotes" }}>
          {({ navigation }) => <CrushNoteScreen onDone={() => navigation.goBack()} />}
        </Stack.Screen>

        <Stack.Screen name="SeasonalForm" options={{ title: "Formulaire du mois" }}>
          {({ navigation }) => <SeasonalFormScreen onDone={() => navigation.goBack()} />}
        </Stack.Screen>

        <Stack.Screen name="PassionQuiz" options={{ title: "Quiz musique" }}>
          {({ navigation }) => <PassionQuizScreen onDone={() => navigation.goBack()} />}
        </Stack.Screen>

        <Stack.Screen
          name="Subscribe"
          options={({ navigation }) => ({
            headerTitle: () => <MeetoraHeaderTitle />,
            headerRight: () => (
              <Pressable
                onPress={() => navigation.navigate("Account", { email: accountEmail })}
                hitSlop={12}
              >
                <Text style={{ color: colors.accent, fontWeight: "700" }}>Compte</Text>
              </Pressable>
            ),
          })}
        >
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
