import { useState } from "react";
import { Alert, Image, Pressable, Text, View } from "react-native";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PhoneShell } from "./src/components/PhoneShell";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { SubscribeScreen } from "./src/screens/SubscribeScreen";
import { AccountScreen } from "./src/screens/AccountScreen";
import { colors } from "./src/theme";

function MeetoraHeaderTitle() {
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
  Profile: undefined;
  Subscribe: undefined;
  Account: { email?: string } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: colors.bgElevated,
    text: colors.text,
    border: colors.line,
    primary: colors.accent,
  },
};

export default function App() {
  const [accountEmail, setAccountEmail] = useState<string>("");

  return (
    <PhoneShell>
      <SafeAreaProvider>
        <NavigationContainer theme={navTheme}>
          <StatusBar style="light" />
          <Stack.Navigator
            initialRouteName="Profile"
            screenOptions={{
              headerStyle: { backgroundColor: colors.bgElevated },
              headerTintColor: colors.text,
              contentStyle: { backgroundColor: colors.bg },
              headerShadowVisible: false,
            }}
          >
            <Stack.Screen
              name="Profile"
              options={({ navigation }) => ({
                headerTitle: () => <MeetoraHeaderTitle />,
                headerRight: () => (
                  <Pressable
                    onPress={() => navigation.navigate("Subscribe")}
                    hitSlop={12}
                    style={{ paddingVertical: 8, paddingHorizontal: 4 }}
                  >
                    <Text style={{ color: colors.accent, fontWeight: "700" }}>Formules</Text>
                  </Pressable>
                ),
              })}
            >
              {({ navigation }) => (
                <ProfileScreen
                  onEditPress={() =>
                    Alert.alert(
                      "Modifier le profil",
                      "Bientôt : photo, bio, ville et préférences. Placeholder pour la critique."
                    )
                  }
                  onSubscribePress={() => navigation.navigate("Subscribe")}
                />
              )}
            </Stack.Screen>
            <Stack.Screen
              name="Subscribe"
              options={({ navigation }) => ({
                headerTitle: () => <MeetoraHeaderTitle />,
                headerRight: () => (
                  <Pressable
                    onPress={() => navigation.navigate("Account", { email: accountEmail })}
                    hitSlop={12}
                    style={{ paddingVertical: 8, paddingHorizontal: 4 }}
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
              {({ route }) => (
                <AccountScreen initialEmail={route.params?.email || accountEmail} />
              )}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </PhoneShell>
  );
}
