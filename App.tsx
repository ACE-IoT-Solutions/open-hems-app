import React, { useEffect } from "react";
import { Platform, StatusBar } from "react-native";
import AppLoading from "expo-app-loading";
import { NavigationContainer } from "@react-navigation/native";

import { AppNavigator } from "./navigators/AppNavigator";
import { useFonts, Rubik_300Light, Rubik_400Regular, Rubik_500Medium } from "@expo-google-fonts/rubik";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { theme } from "./theme";

export default function App() {
  const [fontsLoaded] = useFonts({
    Rubik_300Light,
    Rubik_400Regular,
    Rubik_500Medium,
  });

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
            <AppNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </ErrorBoundary>
    );
  }
}
