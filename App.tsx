import React, { useEffect } from "react";
import { Platform, StatusBar } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { NavigationContainer } from "@react-navigation/native";
import { getStorageMacAddress, getWelcomeDismissed } from "./utils/api";

import { AppNavigator } from "./navigators/AppNavigator";
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
import { useInitialRouteName, useWelcomeDismissed } from "./hooks/useAppStateData";
import {
  Arimo_400Regular,
  Arimo_500Medium,
  Arimo_600SemiBold,
  Arimo_700Bold,
  useFonts,
} from "@expo-google-fonts/arimo";

SplashScreen.preventAutoHideAsync();

const { Navigator, Screen } = createNativeStackNavigator<AppScreenParamsList>();

function MainNavigator({ initialRouteName: initialRouteName }: { initialRouteName: keyof AppScreenParamsList }) {
  const headerTintColor = theme.text;
  const headerTitleStyle = {
    fontFamily: theme.fonts.title,
  };

  return (
    <Navigator initialRouteName={initialRouteName}>
      <Screen name="WelcomeScreen" component={WelcomeScreen} options={{ headerShown: false }} />
      <Screen name="MacAddress" component={MacAddressScreen} options={{ animation: "none", headerShown: false }} />
      <Screen name="AppNavigator" component={AppNavigator} options={{ animation: "none", headerShown: false }} />

      <Screen name="Options" component={OptionsMenuScreen} />
      <Screen name="SettingsScreen" component={SettingsScreen} options={{ headerTintColor, headerTitleStyle }} />
      <Screen name="AuthTokenScreen" component={AuthTokenScreen} options={{ headerTintColor, headerTitleStyle }} />
    </Navigator>
  );
}

export default function App() {
  // const { welcomeDismissedState, error, loading, getWelcomeDismissedState, setWelcomeDismissedEffect } = useWelcomeDismissed();
  // const initialRouteName = welcomeDismissedState ? "AppNavigator" : "WelcomeScreen" as keyof AppScreenParamsList;
  const { initialRouteNameState, error, loading, getInitialRouteName } = useInitialRouteName();
  const [fontsLoaded] = useFonts({
    Arimo_400Regular,
    Arimo_500Medium,
    Arimo_600SemiBold,
    Arimo_700Bold,
  });

  console.log("app.tsx", initialRouteNameState);

  useEffect(() => {
    StatusBar.setBarStyle("dark-content");

    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor(theme.background);
    }
    // getInitialRouteName();
  });

  if (!fontsLoaded || loading) {
    return;
  } else {
    SplashScreen.hideAsync();
    return (
      <ErrorBoundary>
        <SafeAreaProvider>
          <NavigationContainer>
            <MainNavigator initialRouteName={initialRouteNameState} />
          </NavigationContainer>
        </SafeAreaProvider>
      </ErrorBoundary>
    );
  }
}
