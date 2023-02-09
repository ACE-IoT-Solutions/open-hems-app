import React, { useEffect } from "react";
import { Platform, StatusBar } from "react-native";
import AppLoading from "expo-app-loading";
import { NavigationContainer } from "@react-navigation/native";

import { AppNavigator } from "./navigators/AppNavigator";
import { useFonts, Rubik_300Light, Rubik_400Regular, Rubik_500Medium } from "@expo-google-fonts/rubik";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { theme } from "./theme";
import { WelcomeScreen } from "./screens/WelcomeScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppScreenParamsList } from "./types";
import { MacAddressScreen } from "./screens/MacAddressScreen";
import { OptionsMenuScreen } from "./screens/OptionsMenuScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { AuthTokenScreen } from "./screens/AuthTokenScreen";

const { Navigator, Screen } = createNativeStackNavigator<AppScreenParamsList>();

function MainNavigator() {
  const headerTintColor = theme.text;
  const headerTitleStyle = {
    fontFamily: theme.fonts.title,
  };

  return (
    <Navigator initialRouteName="DebugWelcome">
      <Screen name="DebugWelcome" component={WelcomeScreen} options={{ headerShown: false }} />
      <Screen name="DebugMacAddress" component={MacAddressScreen} options={{ animation: "none", headerShown: false }} />
      <Screen name="AppNavigator" component={AppNavigator} options={{ animation: "none", headerShown: false }} />

      <Screen name="Options" component={OptionsMenuScreen} />
      <Screen name="SettingsScreen" component={SettingsScreen} options={{ headerTintColor, headerTitleStyle }} />
      <Screen name="AuthTokenScreen" component={AuthTokenScreen} options={{ headerTintColor, headerTitleStyle }} />
    </Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Rubik_300Light,
    Rubik_400Regular,
    Rubik_500Medium,
  });

  // console.log("process.env.NODE_ENV: ", process.env.NODE_ENV);

  useEffect(() => {
    StatusBar.setBarStyle("dark-content");

    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor(theme.background);
    }
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <ErrorBoundary>
        <SafeAreaProvider>
          <NavigationContainer>
            <MainNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </ErrorBoundary>
    );
  }
}
