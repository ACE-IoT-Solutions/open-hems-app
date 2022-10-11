import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

export type DeviceParams = { deviceName: string; deviceId: DeviceId };
// export type DeviceScreenName = "Thermostat" | "SolarPanel" | "CarCharger" | "WaterHeater" | "HomeBattery";
export type DeviceScreenName = "Welcome" | "Thermostat" | "SolarPanel" | "CarCharger" | "WaterHeater" | "HomeBattery";

export type DeviceParamList = {
  Welcome: DeviceParams;
  Thermostat: DeviceParams;
  SolarPanel: DeviceParams;
  CarCharger: DeviceParams;
  WaterHeater: DeviceParams;
  HomeBattery: DeviceParams;
};

export type DeviceNavigationProps = BottomTabNavigationProp<DeviceParamList>;
export type MainNavigationProps = NativeStackNavigationProp<DeviceParamList>;

export type WelcomeScreenRouteProps = RouteProp<DeviceParamList, "Welcome">;
export type ThermostatScreenRouteProps = RouteProp<DeviceParamList, "Thermostat">;
export type SolarPanelScreenRouteProps = RouteProp<DeviceParamList, "SolarPanel">;
export type CarChargerScreenRouteProps = RouteProp<DeviceParamList, "CarCharger">;
export type WaterHeaterScreenRouteProps = RouteProp<DeviceParamList, "WaterHeater">;
export type HomeBatteryScreenRouteProps = RouteProp<DeviceParamList, "HomeBattery">;
export type DeviceScreenRouteProps =
  | WelcomeScreenRouteProps
  | ThermostatScreenRouteProps
  | SolarPanelScreenRouteProps
  | CarChargerScreenRouteProps
  | WaterHeaterScreenRouteProps
  | HomeBatteryScreenRouteProps;

export type UpdateDeviceParamList = {
  HomeBatteryUpdateReserveLimit: DeviceParams & { reserve_limit: Percentage; showOptOutButton: boolean };
};

export type UpdateDeviceScreenRouteProps = RouteProp<UpdateDeviceParamList>;
export type HomeBatteryUpdateReserveLimitScreenRouteProp = RouteProp<
  UpdateDeviceParamList,
  "HomeBatteryUpdateReserveLimit"
>;

type DemandResponseParams = {
  title: string;
  deviceId?: DeviceId;
  showOptOutButton?: boolean;
};

export type DemandResponseScreenRouteProps = RouteProp<DemandResponseParams>;

type AppScreenParamsList = {
  AppNavigator: undefined;
  DeviceList: undefined;
  SettingsScreen: undefined;
  AuthTokenScreen: undefined;
  Options: undefined;
  DemandResponseMessage: DemandResponseParams;
  ReserveLimit: DeviceParams;

  Debug: undefined;
  StyleGuide: undefined;
  ErrorScreen: undefined;

  DebugWelcome: WelcomeScreenRouteProps;
  DebugThermostat: ThermostatScreenRouteProps;
  DebugCarCharger: CarChargerScreenRouteProps;
  DebugSolarPanel: SolarPanelScreenRouteProps;
  DebugWaterHeater: WaterHeaterScreenRouteProps;
  DebugHomeBattery: HomeBatteryScreenRouteProps;
};

type AppRouteName = keyof AppScreenParamsList;
export type AppNavigationProp = NativeStackNavigationProp<AppScreenParamsList>;
export type AppRouteProps = RouteProp<AppScreenParamsList>;
