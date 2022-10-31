import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DeviceNavigator } from "./DeviceNavigator";
import { OptionsMenuScreen } from "../screens/OptionsMenuScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { DemandResponseMessageScreen } from "../screens/DemandResponseMessageScreen";
import { ReserveLimitScreen } from "../screens/ReserveLimitScreen";
import { AppScreenParamsList, DeviceScreenRouteProps } from "../types";
import { theme } from "../theme";
import { ScreensList } from "../screens/ScreensList";
import { ThermostatScreen } from "../screens/ThermostatScreen";
import { StyleGuideScreen } from "../screens/StyleGuideScreen";
import { CarChargerScreen } from "../screens/CarChargerScreen";
import { HomeBatteryScreen } from "../screens/HomeBatteryScreen";
import { SolarPanelScreen } from "../screens/SolarPanelScreen";
import { WaterHeaterScreen } from "../screens/WaterHeaterScreen";
import { AuthTokenScreen } from "../screens/AuthTokenScreen";

const { Navigator, Screen } = createNativeStackNavigator<AppScreenParamsList>();

export function AppNavigator() {
  const headerTintColor = theme.text;
  const headerTitleStyle = {
    fontFamily: theme.fonts.title,
  };

  const deviceScreenOptions = ({ route }: { route: DeviceScreenRouteProps }) => ({
    title: route?.params?.deviceName,
    headerTintColor,
    headerTitleStyle,
  });

  return (
    <Navigator initialRouteName="DeviceList">
      <Screen name="DeviceList" component={DeviceNavigator} options={{ headerShown: false }} />
      <Screen
        name="DemandResponseMessage"
        component={DemandResponseMessageScreen}
        options={({ route }) => ({ title: route.params.title })}
      />
      <Screen
        name="ReserveLimit"
        component={ReserveLimitScreen}
        options={{ headerTintColor, headerTitleStyle, title: "Set Reserve Limit" }}
      />
      <Screen name="Options" component={OptionsMenuScreen} options={{ headerTintColor, headerTitleStyle }} />
      <Screen name="SettingsScreen" component={SettingsScreen} options={{ headerTintColor, headerTitleStyle }} />
      <Screen name="AuthTokenScreen" component={AuthTokenScreen} options={{ headerTintColor, headerTitleStyle }} />
      <Screen name="Debug" component={ScreensList} options={{ headerTintColor, headerTitleStyle }} />

      <Screen name="StyleGuide" component={StyleGuideScreen} />
      <Screen name="ErrorScreen">
        {() => {
          throw new Error("Error Screen");
        }}
      </Screen>
      <Screen name="DebugThermostat" component={ThermostatScreen} options={deviceScreenOptions} />
      <Screen name="DebugCarCharger" component={CarChargerScreen} options={deviceScreenOptions} />
      <Screen name="DebugSolarPanel" component={SolarPanelScreen} options={deviceScreenOptions} />
      <Screen name="DebugWaterHeater" component={WaterHeaterScreen} options={deviceScreenOptions} />
      <Screen name="DebugHomeBattery" component={HomeBatteryScreen} options={deviceScreenOptions} />
    </Navigator>
  );
}
