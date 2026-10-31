import { useState } from "react";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { Pressable, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SubscribeScreen } from "./src/screens/SubscribeScreen";
import { AccountScreen } from "./src/screens/AccountScreen";
import { colors } from "./src/theme";

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
              title: "Souscrire",
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
          <Stack.Screen name="Account" options={{ title: "Mon compte" }}>
            {({ route }) => <AccountScreen initialEmail={route.params?.email || accountEmail} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
