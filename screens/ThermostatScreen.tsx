import React, { useCallback, useEffect, useState } from "react";
import { debounce, some } from "lodash";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  ScrollView,
  RefreshControl,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { useDeviceData } from "../hooks/useDeviceData";
import { useHomeConfigData } from "../hooks/useHomeConfigData";
import { ThermostatUpdateSetPointPayload, useDeviceUpdateDerStatus, useThermostatUpdateSetPoint } from "../hooks/api";
import { AppNavigationProp, ThermostatData, ThermostatScreenRouteProps } from "../types";
import { theme, typography } from "../theme";
import { isActiveDemandResponseStatus, shouldPresentDemandResponse } from "../utils/hems";
import { getLocalTemperature, isMetric } from "../utils/getLocalTemperature";

import { ThermostatModePicker } from "../components/ThermostatScreen/ThermostatModePicker";
import { ThermostatModePickerData } from "../components/ThermostatScreen/ThermostatModePickerItem";
import { ThermostatGauge } from "../components/ThermostatScreen/ThermostatGauge";
import { ConditionalDemandResponse } from "../components/DemandResponse/ConditionalDemandResponse";
import { WeatherIcon } from "../components/WeatherIcon";
import { DataBoundary } from "../components/DataBoundary";
import CoolModeIcon from "../assets/svg/thermostat-modes/cool-mode.svg";
import AutoModeIcon from "../assets/svg/thermostat-modes/auto-mode.svg";
import HeatModeIcon from "../assets/svg/thermostat-modes/heat-mode.svg";
import EcoModeIcon from "../assets/svg/thermostat-modes/eco-mode.svg";
import { ErrorLabel } from "../components/ErrorLabel";
import { OptOutModal } from "../components/OptOutModal";

export function ThermostatScreen() {
  const dimensions = useWindowDimensions();
  const route = useRoute<ThermostatScreenRouteProps>();
  const navigation = useNavigation<AppNavigationProp>();

  const { deviceId } = route.params;
  const { data, error, loading, getData } = useDeviceData<ThermostatData>(deviceId, { initialFetch: false });
  const [newSetpointData, setNewSetpointData] = useState<ThermostatUpdateSetPointPayload>();
  const {
    data: homeConfigData,
    error: homeConfigError,
    loading: homeConfigLoading,
    getData: homeConfigGetData,
  } = useHomeConfigData();
  const {
    update: networkUpdateSetpoint,
    loading: updateLoading,
    error: updateError,
  } = useThermostatUpdateSetPoint(deviceId);
  const {
    update: updateDrStatus,
    loading: updateDrStatusLoading,
    error: updateDrStatusError,
  } = useDeviceUpdateDerStatus(deviceId);
  const [isLoading, setIsLoading] = useState(false);

  const [pendingActivity, setPendingActivity] = useState(false);
  const debouncedSetIsLoading = useCallback(debounce(setIsLoading, 100), []);
  useEffect(() => {
    debouncedSetIsLoading(some([loading, updateLoading, updateDrStatusLoading]));
  }, [loading, updateLoading, updateDrStatusLoading]);
  const debouncedUpdateSetpoint = useCallback(debounce(updateSetpoint, 2000), [data]);

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const demandRespondTitle = homeConfigData?.lpc_config.current_event_message.title;
  const thermostatModes: ThermostatModePickerData[] = [
    { mode: "auto", icon: <AutoModeIcon /> },
    { mode: "heat", icon: <HeatModeIcon /> },
    { mode: "cool", icon: <CoolModeIcon /> },
    { mode: "eco", icon: <EcoModeIcon /> },
    { mode: "off" },
  ];

  function refresh() {
    getData();
    homeConfigGetData();
  }

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [deviceId])
  );

  useEffect(() => {
    if (!data || loading) {
      return;
    }

    setNewSetpointData(data);
  }, [data, updateError]);

  function setNewSetpoint(setpointData: Partial<ThermostatUpdateSetPointPayload>) {
    console.log("setNewSetpoint", setpointData);
    if (!newSetpointData) {
      return;
    }

    const newNewSetpointData = { ...newSetpointData, ...setpointData };
    setNewSetpointData(newNewSetpointData);
    setPendingActivity(true);
    debouncedUpdateSetpoint(newNewSetpointData);
  }

  async function updateSetpoint(setpointData: ThermostatUpdateSetPointPayload) {
    if (!data) {
      return;
    }

    if (isActiveDemandResponseStatus(data.dr_status)) {
      setModalVisible(true);
      return;
    }

    setPendingActivity(false);
    setIsLoading(true);

    const response = await networkUpdateSetpoint(setpointData);

    if (response.success) {
      refresh();
    }
  }

  function cancelModal() {
    if (!data) {
      return;
    }
    setModalVisible(false);
    setPendingActivity(false);
    setNewSetpointData({ setpoint: data.setpoint, mode: data.mode });
  }

  async function confirmModal() {
    if (!newSetpointData) {
      return;
    }

    setModalVisible(false);
    await updateDrStatus({ status: "opted_out" });
    await networkUpdateSetpoint(newSetpointData);
    await refresh();
  }

  return (
    <DataBoundary
      loading={loading || homeConfigLoading}
      error={error || homeConfigError}
      data={data && homeConfigData}
      onPressRetry={refresh}
    >
      <>
        {data && homeConfigData && newSetpointData && (
          <SafeAreaView testID="ThermostatScreen" style={styles.container}>
            <ScrollView style={{ flex: 1 }} refreshControl={<RefreshControl refreshing={false} onRefresh={refresh} />}>
              <View
                testID="ThermostatScreen-device-data"
                style={[styles.content, { height: dimensions.height - 157, width: dimensions.width }]}
              >
                <View style={styles.outdoorTemp}>
                  <WeatherIcon testID="exteriorWeatherSvg" weather={data.exterior_weather} />
                  <Text testID="ThermostatScreen-outdoor-temp" style={styles.outdoorTempText}>
                    {getLocalTemperature(data.exterior_temperature)}&deg; Outside
                  </Text>
                </View>
                <View style={styles.thermostatGauge}>
                  <ThermostatGauge
                    label="Indoor"
                    disabled={isLoading}
                    drStatus={data.dr_status}
                    mode={data.mode}
                    pendingActivity={pendingActivity}
                    setPoint={newSetpointData.setpoint}
                    interiorTemp={data.interior_temperature}
                    onPressWarm={() =>
                      isMetric
                        ? setNewSetpoint({ setpoint: newSetpointData.setpoint + 1 })
                        : setNewSetpoint({ setpoint: newSetpointData.setpoint + 0.56 })
                    }
                    onPressCool={() =>
                      isMetric
                        ? setNewSetpoint({ setpoint: newSetpointData.setpoint - 1 })
                        : setNewSetpoint({ setpoint: newSetpointData.setpoint - 0.56 })
                    }
                    onDrag={({ direction }) => {
                      setNewSetpoint({ setpoint: newSetpointData.setpoint + 0.2 * (direction === "up" ? 1 : -1) });
                    }}
                  />
                  <View style={styles.updateStatus}>
                    {isLoading && <ActivityIndicator testID="ThermostatUpdateActivityIndicator" />}
                    {(updateError || updateDrStatusError) && (
                      <ErrorLabel
                        testID="ThermostatUpdateError"
                        style={styles.errorLabel}
                        message="Failed to update Thermostat"
                      />
                    )}
                  </View>
                </View>
                <View>
                  <View style={styles.picker}>
                    <ThermostatModePicker
                      options={thermostatModes}
                      selectedMode={newSetpointData.mode}
                      onChange={(mode) => setNewSetpoint({ mode })}
                    />
                  </View>
                  {shouldPresentDemandResponse(data.dr_status) && (
                    <ConditionalDemandResponse
                      drStatus={data.dr_status}
                      onPress={() => navigation.navigate("DemandResponseMessage", { title: demandRespondTitle })}
                    />
                  )}
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        )}
        <OptOutModal
          message="This Thermostat setting adds a burden on the system and could negatively impact the environment."
          visible={modalVisible}
          onPressGoBack={cancelModal}
          onPressConfirm={confirmModal}
        />
      </>
    </DataBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexWrap: "wrap",
    backgroundColor: theme.background,
    paddingBottom: theme.padding,
  },
  content: {
    flex: 1,
    marginVertical: 0,
    justifyContent: "space-between",
    width: theme.windowWidth,
    paddingHorizontal: theme.padding,
    paddingBottom: theme.padding,
  },
  outdoorTemp: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.padding / 4,
    paddingTop: theme.padding / 2,
  },
  outdoorTempText: {
    ...typography.text,
    marginLeft: 6,
  },
  thermostatGauge: {
    transform: [{ scale: 1.25 }],
    padding: 0,
  },
  updateStatus: {
    minHeight: 20,
    margin: theme.padding,
  },
  errorLabel: {
    textAlign: "center",
  },
  picker: {
    marginBottom: theme.padding / 2,
  },
  secondaryTempLabel: {
    ...typography.label,
    marginBottom: 2,
  },
});
