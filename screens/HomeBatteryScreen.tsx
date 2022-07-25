import React, { useCallback, useEffect, useState } from "react";
import { useRoute, useNavigation, useFocusEffect } from "@react-navigation/native";
import { useDeviceData } from "../hooks/useDeviceData";
import { useHomeConfigData } from "../hooks/useHomeConfigData";
import {
  StyleSheet,
  View,
  SafeAreaView,
  ActivityIndicator,
  useWindowDimensions,
  RefreshControl,
  ScrollView,
} from "react-native";
import { BatteryStatus } from "../components/HomeBattery/BatteryStatus";
import { HomeBatteryData, HomeBatteryScreenRouteProps, AppNavigationProp, ChargeRate } from "../types";

import { HorizontalProgressMeter } from "../components/HorizontalProgressMeter";
import { ServiceLabel } from "../components/ServiceLabel";
import { theme } from "../theme";
import { Button } from "../components/Button";
import { DataBoundary } from "../components/DataBoundary";
import { isActiveDemandResponseStatus, shouldPresentDemandResponse } from "../utils/hems";
import { ConditionalDemandResponse } from "../components/DemandResponse/ConditionalDemandResponse";
import { ChargeRateSlider } from "../components/ChargeRateSlider";
import { useDeviceUpdateDerStatus, useHomeBatteryUpdateChargeRate } from "../hooks/api";
import { ErrorLabel } from "../components/ErrorLabel";
import { OptOutModal } from "../components/OptOutModal";

export function HomeBatteryScreen() {
  const dimensions = useWindowDimensions();
  const navigation = useNavigation<AppNavigationProp>();
  const route = useRoute<HomeBatteryScreenRouteProps>();

  const { deviceId } = route.params;

  const { getData, data, error, loading } = useDeviceData<HomeBatteryData>(deviceId, { initialFetch: false });
  const {
    data: homeConfigData,
    error: homeConfigError,
    loading: homeConfigLoading,
    getData: homeConfigGetData,
  } = useHomeConfigData();
  const demandRespondTitle = homeConfigData?.lpc_config.current_event_message.title;

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [newChargeRate, setNewChargeRate] = useState(data?.charge_rate);
  const { update, loading: updateLoading, error: updateError } = useHomeBatteryUpdateChargeRate(deviceId);
  const {
    update: updateDrStatus,
    loading: updateDrStatusLoading,
    error: updateDrStatusError,
  } = useDeviceUpdateDerStatus(deviceId);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [deviceId])
  );

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

    await updateChargeRate(newChargeRate, true);

    setModalVisible(false);
    setNewChargeRate(undefined);
  }

  async function refresh() {
    await getData();
    await homeConfigGetData();
  }

  function navigateToReserveLimit() {
    navigation.navigate("ReserveLimit", {
      deviceId,
      reserveLimit: data?.reserve_limit,
      showOptOutModal: isActiveDemandResponseStatus(data?.dr_status),
    });
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
              <View style={{ height: dimensions.height - 157 }}>
                <View style={{ margin: theme.padding, marginTop: theme.padding - 4, marginLeft: theme.padding - 4 }}>
                  <BatteryStatus
                    status={data.status}
                    chargeRate={data.charge_rate}
                    chargePercentage={data.charge_percentage}
                  />
                </View>
                <HorizontalProgressMeter chargePercentage={data.charge_percentage} reserveLimit={data.reserve_limit} />
                <View style={styles.textContainer}>
                  <ServiceLabel dr_status={data.dr_status} />
                  {(updateLoading || updateDrStatusLoading || loading) && (
                    <ActivityIndicator style={{ margin: theme.padding, alignSelf: "center" }} />
                  )}
                </View>
                <View style={[styles.chargeRate, { width: dimensions.width }]}>
                  {(updateError || updateDrStatusError) && (
                    <ErrorLabel style={{ margin: theme.padding }} message="Failed to update charge rate." />
                  )}

                  <ChargeRateSlider chargeRate={newChargeRate} onSlidingComplete={setNewChargeRate}>
                    <Button testID="SetReserveLimitButton" label="Set Reserve Limit" onPress={navigateToReserveLimit} />
                  </ChargeRateSlider>
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
          message="Charging at this rate adds a burden on the system and could negatively impact the environment."
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
    justifyContent: "space-between",
    backgroundColor: theme.background,
  },
  textContainer: {
    marginVertical: 16,
    marginHorizontal: 14,
  },
  chargeRate: {
    marginTop: "auto",
  },
  demandResponse: {
    margin: theme.padding,
  },
  header: {
    marginHorizontal: theme.padding,
  },
});
