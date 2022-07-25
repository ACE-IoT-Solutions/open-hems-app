import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  ActivityIndicator,
  useWindowDimensions,
  RefreshControl,
  ScrollView,
} from "react-native";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { AppNavigationProp, CarChargerData, CarChargerScreenRouteProps } from "../types";
import { useHomeConfigData } from "../hooks/useHomeConfigData";
import { useDeviceData } from "../hooks/useDeviceData";
import { theme } from "../theme";
import { useDeviceUpdateDerStatus, useEvChargerUpdateChargeRate } from "../hooks/api";

import { HorizontalProgressMeter } from "../components/HorizontalProgressMeter";
import { ServiceLabel } from "../components/ServiceLabel";
import { ChargeRateSlider } from "../components/ChargeRateSlider";
import { isActiveDemandResponseStatus, shouldPresentDemandResponse } from "../utils/hems";
import { ConditionalDemandResponse } from "../components/DemandResponse/ConditionalDemandResponse";
import { ChargeRate } from "../types";
import { DataBoundary } from "../components/DataBoundary";
import { BatteryStatus } from "../components/HomeBattery/BatteryStatus";
import { ErrorLabel } from "../components/ErrorLabel";
import { OptOutModal } from "../components/OptOutModal";

export function CarChargerScreen() {
  const dimensions = useWindowDimensions();
  const route = useRoute<CarChargerScreenRouteProps>();
  const navigation = useNavigation<AppNavigationProp>();
  const { deviceId } = route.params;
  const { data, error, loading, getData } = useDeviceData<CarChargerData>(deviceId, { initialFetch: false });
  const [newChargeRate, setNewChargeRate] = useState<ChargeRate>();
  const { update, loading: updateLoading, error: updateError } = useEvChargerUpdateChargeRate(deviceId);
  const {
    update: updateDrStatus,
    loading: updateDrStatusLoading,
    error: updateDrStatusError,
  } = useDeviceUpdateDerStatus(deviceId);

  const {
    data: homeConfigData,
    error: homeConfigError,
    loading: homeConfigLoading,
    getData: homeConfigGetData,
  } = useHomeConfigData();
  const demandRespondTitle = homeConfigData?.lpc_config.current_event_message.title;

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const refresh = () => {
    getData();
    homeConfigGetData();
  };

  useFocusEffect(useCallback(refresh, [deviceId]));

  useEffect(() => {
    if (!data || newChargeRate === data?.charge_rate) {
      return;
    }

    if (!newChargeRate) {
      setNewChargeRate(data.charge_rate);
      return;
    }

    if (isActiveDemandResponseStatus(data.dr_status)) {
      setModalVisible(true);
    } else {
      updateChargeRate(newChargeRate, false);
    }
  }, [newChargeRate, data]);

  async function updateChargeRate(chargeRate: ChargeRate, optOutOfDemandResponse: boolean) {
    if (!data || !chargeRate) {
      return;
    }

    if (optOutOfDemandResponse) {
      await updateDrStatus({ status: "opted_out" });
    }

    await update({ charge_rate: chargeRate });
    await refresh();
  }

  function cancelModal() {
    setModalVisible(false);
    setNewChargeRate(data?.charge_rate);
  }

  async function confirmModal() {
    if (!newChargeRate) {
      return;
    }

    setModalVisible(false);
    await updateDrStatus({ status: "opted_out" });
    await update({ charge_rate: newChargeRate });
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
        {data && homeConfigData && (
          <SafeAreaView style={styles.container}>
            <ScrollView style={{ flex: 1 }} refreshControl={<RefreshControl refreshing={false} onRefresh={refresh} />}>
              <View style={[styles.innerContainer, { height: dimensions.height - 157 }]}>
                <View style={{ margin: theme.padding, marginTop: theme.padding - 4, marginLeft: theme.padding - 4 }}>
                  <BatteryStatus
                    status={data.status}
                    chargeRate={data.charge_rate}
                    chargePercentage={data.charge_percentage}
                  />
                </View>
                <HorizontalProgressMeter chargePercentage={data.charge_percentage} />
                <View style={styles.service}>
                  <ServiceLabel dr_status={data.dr_status} />
                </View>
                {newChargeRate && <ChargeRateSlider chargeRate={newChargeRate} onSlidingComplete={setNewChargeRate} />}
                <View style={styles.updateStatus}>
                  {(updateLoading || updateDrStatusLoading || loading) && (
                    <ActivityIndicator testID="CarChargerUpdateActivityIndicator" />
                  )}
                  {(updateError || updateDrStatusError) && (
                    <ErrorLabel testID="CarChargerUpdateError" message="Failed to update charge rate" />
                  )}
                </View>
                {shouldPresentDemandResponse(data.dr_status) && (
                  <View style={styles.demandResponse}>
                    <ConditionalDemandResponse
                      drStatus={data.dr_status}
                      onPress={() => navigation.navigate("DemandResponseMessage", { title: demandRespondTitle })}
                    />
                  </View>
                )}
              </View>
            </ScrollView>
          </SafeAreaView>
        )}
        <OptOutModal
          message="This setting adds a burden on the system and could negatively impact the environment."
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
    backgroundColor: theme.background,
    paddingBottom: theme.padding,
  },
  innerContainer: {
    flex: 1,
  },
  chargeRatesContainer: {
    justifyContent: "center",
    flexDirection: "row",
  },
  service: {
    padding: theme.padding,
  },
  demandResponse: {
    marginTop: "auto",
    paddingHorizontal: theme.padding,
    paddingVertical: theme.padding,
  },
  header: {
    marginHorizontal: theme.padding,
  },
  updateStatus: {
    margin: theme.padding,
  },
});
