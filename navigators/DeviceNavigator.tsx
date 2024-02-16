import React, { RefObject, useRef, useState } from "react";
import { Text, TouchableOpacity, View, ScrollView, ViewStyle, LayoutChangeEvent, SafeAreaView } from "react-native";
import { useDeviceListData } from "../hooks/useDeviceListData";
import { theme, typography } from "../theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppNavigationProp, DeviceData, DeviceScreenName, DeviceScreenRouteProps, DeviceType } from "../types";
import { ThermostatScreen } from "../screens/ThermostatScreen";
import { CarChargerScreen } from "../screens/CarChargerScreen";
import { SolarPanelScreen } from "../screens/SolarPanelScreen";
import { WaterHeaterScreen } from "../screens/WaterHeaterScreen";
import { HomeBatteryScreen } from "../screens/HomeBatteryScreen";
import { WelcomeScreen } from "../screens/WelcomeScreen";

import { createBottomTabNavigator, BottomTabBarProps, BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { DataBoundary } from "../components/DataBoundary";
import { DeviceHeader } from "../components/DeviceHeader";
import { useNavigation } from "@react-navigation/native";
import { NavigationSwipeResponder } from "../components/NavigationSwipeResponder";
import { MacAddressScreen } from "../screens/MacAddressScreen";

const DeviceTabNavigator = createBottomTabNavigator();
type DeviceNavigationProps = BottomTabBarProps;

function DeviceScreenTab(device: DeviceData) {
  const deviceType = device.type as DeviceType;

  const deviceNavigationName: Record<DeviceType, DeviceScreenName> = {
    // welcome: "Welcome",
    thermostat: "Thermostat",
    ev_charger: "CarCharger",
    pv_system: "SolarPanel",
    water_heater: "WaterHeater",
    home_battery: "HomeBattery",
  };

  const deviceScreenName = {
    // Welcome: WelcomeScreen,
    MacAddress: MacAddressScreen,
    Thermostat: ThermostatScreen,
    CarCharger: CarChargerScreen,
    SolarPanel: SolarPanelScreen,
    WaterHeater: WaterHeaterScreen,
    HomeBattery: HomeBatteryScreen,
  };

  const options = ({ route }: { route: DeviceScreenRouteProps }) => ({
    title: route?.params?.deviceName,
    tabBarActiveTintColor: theme.primary,
    tabBarInactiveTintColor: theme.backdrop,
    headerShown: false,
  });

  const initialParams = {
    deviceId: device.id,
    deviceName: device.name,
  };

  return (
    <DeviceTabNavigator.Screen
      key={deviceType}
      name={deviceNavigationName[deviceType]}
      options={options}
      initialParams={initialParams}
    >
      {({ route, navigation }) => {
        const DeviceScreen = deviceScreenName[route.name];
        return (
          <NavigationSwipeResponder>
            <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
              <DeviceHeader deviceName={device.name} onPressAccount={() => navigation.navigate("Options")} />
              <DeviceScreen />
            </SafeAreaView>
          </NavigationSwipeResponder>
        );
      }}
    </DeviceTabNavigator.Screen>
  );
}

function routeLabel(options: BottomTabNavigationOptions, route: { name: string }) {
  return options.tabBarLabel !== undefined
    ? options.tabBarLabel
    : options.title !== undefined
    ? options.title
    : route.name;
}

type DeviceTabBarParams = {
  scrollViewRef: RefObject<ScrollView>;
  scrollViewWidth: number;
  setScrollViewWidth: (v: number) => void;

  scrollState: Record<string, number>;
  setScrollState: (state: Record<string, number>) => void;
};

function DeviceTabBar({
  scrollViewRef,
  scrollState,
  setScrollState,
  scrollViewWidth,
  setScrollViewWidth,
}: DeviceTabBarParams) {
  return ({ state, descriptors, navigation }: DeviceNavigationProps) => {
    const routeTabs = state.routes.map((route, index) => {
      const { options } = descriptors[route.key];
      const label = routeLabel(options, route);
      const isFocused = state.index === index;

      if (isFocused && scrollViewRef.current) {
        const offset = scrollState[route.key] - scrollViewWidth / 2;
        const scrollView = scrollViewRef.current;

        scrollView.scrollTo({ x: offset, animated: true });
      }

      const onPress = () => {
        const event = navigation.emit({
          type: "tabPress",
          target: route.key,
          canPreventDefault: true,
        });

        if (!isFocused && !event.defaultPrevented) {
          navigation.navigate(route.name);
        }
      };

      const tabStyle: ViewStyle = {
        flex: 1,
        flexGrow: label.length,
        flexWrap: "wrap",
        borderTopWidth: 5,
        borderTopColor: isFocused ? theme.primary : theme.backdrop,
        paddingVertical: 10,
        paddingHorizontal: theme.padding,
        alignItems: "center",
      };

      const onLayout = (event: LayoutChangeEvent) => {
        const layout = event.nativeEvent.layout;
        setScrollState({ ...scrollState, [route.key]: layout.x });
      };

      return (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityState={isFocused ? { selected: true } : {}}
          accessibilityLabel={options.tabBarAccessibilityLabel}
          testID={options.tabBarTestID}
          onPress={onPress}
          style={tabStyle}
          key={route.key}
          onLayout={onLayout}
        >
          <Text style={typography.label} allowFontScaling={false}>
            {label}
          </Text>
        </TouchableOpacity>
      );
    });

    const routeLabels = state.routes.map((route) => {
      return routeLabel(descriptors[route.key].options, route);
    });

    // Give a best guess as to whether or not the device name list will run off the screen.
    // This assumes label padding and assumes average character width. far from perfect
    const totalCharacterCount = routeLabels.join("").length;
    const anticipatedScrollContentLength = totalCharacterCount * 5 + routeLabels.length * 2 * theme.padding;

    // If the device name list will not clip, then span the entire screen width.
    const contentContainerStyle = anticipatedScrollContentLength < theme.windowWidth ? { flex: 1 } : {};

    return (
      <ScrollView
        ref={scrollViewRef}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={contentContainerStyle}
        style={{
          maxHeight: 40,
          marginHorizontal: theme.padding,
        }}
        onLayout={({
          nativeEvent: {
            layout: { width },
          },
        }) => setScrollViewWidth(width)}
      >
        {routeTabs}
      </ScrollView>
    );
  };
}

export function DeviceNavigator() {
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollViewWidth, setScrollViewWidth] = useState<number>(0);
  const [scrollState, setScrollState] = useState({});
  const { data, error, loading, getData } = useDeviceListData();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<AppNavigationProp>();

  const deviceTabBar = DeviceTabBar({
    scrollViewRef,
    scrollState,
    setScrollState,
    scrollViewWidth,
    setScrollViewWidth,
  });
  const deviceScreenList = data?.map(DeviceScreenTab);

  return (
    <DataBoundary
      loading={loading}
      error={error}
      data={data}
      onPressRetry={getData}
      onPressSettings={() => navigation.navigate("Options")}
    >
      <View
        testID="DeviceNavigator"
        style={{
          flex: 1,
          backgroundColor: theme.background,
          paddingBottom: insets.bottom,
        }}
      >
        <DeviceTabNavigator.Navigator tabBar={deviceTabBar}>{deviceScreenList}</DeviceTabNavigator.Navigator>
      </View>
    </DataBoundary>
  );
}
