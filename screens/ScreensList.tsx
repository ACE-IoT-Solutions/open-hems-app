import React from "react";
import { StyleSheet, FlatList, View, Text, ListRenderItemInfo, TouchableOpacity } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { AppScreenParamsList, DeviceType, DeviceId } from "../types";
import { notEmpty } from "../utils/notEmpty.util";

import { useDeviceListData } from "../hooks/useDeviceListData";
import { theme } from "../theme";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { ErrorMessage } from "../components/ErrorMessage";

type DeviceScreenParams = { deviceId: DeviceId; deviceName: string };
type ScreenProps = {
  name: string;
  title: string;
  params?: DeviceScreenParams;
};

type DebugMenuNavigationProp = NativeStackNavigationProp<AppScreenParamsList, "Debug">;

type ScreensListCellProps = Pick<ScreenProps, "title">;
const ScreensListCell = ({ title }: ScreensListCellProps) => (
  <View style={styles.cell}>
    <Text style={styles.cellTitle}>{title}</Text>
  </View>
);

const deviceNavigationName = (deviceType: DeviceType): keyof AppScreenParamsList => {
  const map: Record<DeviceType, keyof AppScreenParamsList> = {
    welcome: "DebugWelcome",
    thermostat: "DebugThermostat",
    ev_charger: "DebugCarCharger",
    pv_system: "DebugSolarPanel",
    water_heater: "DebugWaterHeater",
    home_battery: "DebugHomeBattery",
  };
  return map[deviceType];
};

export const ScreensList = () => {
  const navigation = useNavigation<DebugMenuNavigationProp>();
  const { data, error, loading, getData } = useDeviceListData();

  const deviceScreenList: ScreenProps[] =
    data
      ?.map((device): ScreenProps | undefined => {
        return {
          name: deviceNavigationName(device.type as DeviceType),
          title: device.name,
          params: { deviceId: device.id, deviceName: device.name },
        };
      })
      .filter(notEmpty) ?? [];

  const debugScreenList: ScreenProps[] = [
    {
      name: "StyleGuide",
      title: "Style Guide",
    },
    {
      name: "ErrorScreen",
      title: "Error Screen",
    },
    {
      name: "DebugWelcome",
      title: "Debug Welcome",
    },
  ];

  const screenList = [deviceScreenList, debugScreenList].flat();

  const renderScreensListCell = ({ item: { name, title, params } }: ListRenderItemInfo<ScreenProps>) => {
    const screenName = name as keyof AppScreenParamsList;

    return (
      <TouchableOpacity onPress={() => navigation.navigate(screenName, params)}>
        <ScreensListCell title={title} />
      </TouchableOpacity>
    );
  };

  return (
    <>
      {loading && <LoadingIndicator />}
      {error && <ErrorMessage errorMessage="Could not load device list." onPressRetry={() => getData()} />}
      {data && <FlatList data={screenList} renderItem={renderScreensListCell} keyExtractor={(item) => item.title} />}
    </>
  );
};

const styles = StyleSheet.create({
  cell: {
    backgroundColor: theme.background,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.backdrop,
  },
  cellTitle: {
    color: theme.text,
    fontFamily: theme.fonts.regular,
    fontSize: 18,
  },
});
