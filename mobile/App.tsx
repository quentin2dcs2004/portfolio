import { useState } from "react";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SubscribeScreen } from "./src/screens/SubscribeScreen";
import { AccountScreen } from "./src/screens/AccountScreen";
import { colors } from "./src/theme";

function MeetoraHeaderTitle() {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <Image
        source={require("./assets/meetora-logo.jpg")}
        style={{ width: 28, height: 28, borderRadius: 7 }}
        accessibilityLabel="Meetora"
      />
      <Text style={{ color: colors.text, fontWeight: "800", fontSize: 17 }}>Meetora</Text>
    </View>
  );
}

export type RootStackParamList = {
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
    <SafeAreaProvider>
      <NavigationContainer theme={navTheme}>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: colors.bgElevated },
            headerTintColor: colors.text,
            contentStyle: { backgroundColor: colors.bg },
          }}
        >
          <Stack.Screen
            name="Subscribe"
            options={({ navigation }) => ({
              headerTitle: () => <MeetoraHeaderTitle />,
              headerRight: () => (
                <Pressable onPress={() => navigation.navigate("Account", { email: accountEmail })}>
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
          <Stack.Screen name="Account" options={{ title: "Meetora · Compte" }}>
            {({ route }) => <AccountScreen initialEmail={route.params?.email || accountEmail} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
