import React, { useCallback } from "react";
import { WaterHeaterData, WaterHeaterScreenRouteProps, AppNavigationProp } from "../types";
import { useDeviceData } from "../hooks/useDeviceData";
import { useHomeConfigData } from "../hooks/useHomeConfigData";
import { StyleSheet, View, SafeAreaView, Text, RefreshControl, ScrollView, useWindowDimensions } from "react-native";
import { useRoute, useNavigation, useFocusEffect } from "@react-navigation/native";
import { theme, typography } from "../theme";
import { StatusLabel } from "../components/StatusLabel";
import { ServiceLabel } from "../components/ServiceLabel";
import { shouldPresentDemandResponse } from "../utils/hems";
import { DataBoundary } from "../components/DataBoundary";
import { ConditionalDemandResponse } from "../components/DemandResponse/ConditionalDemandResponse";

import { preparePowerData } from "../utils/visualization";
import { PowerUsageGraph } from "../components/WaterHeaterScreen/PowerUsageGraph";

export function WaterHeaterScreen() {
  const dimensions = useWindowDimensions();
  const route = useRoute<WaterHeaterScreenRouteProps>();
  const navigation = useNavigation<AppNavigationProp>();
  const { deviceId } = route.params;
  const { data, error, loading, getData } = useDeviceData<WaterHeaterData>(deviceId, { initialFetch: false });
  const {
    data: homeConfigData,
    error: homeConfigError,
    loading: homeConfigLoading,
    getData: homeConfigGetData,
  } = useHomeConfigData();

  const demandRespondTitle = homeConfigData?.lpc_config.current_event_message.title;

  const powerUsage = data?.usage_samples?.map((x) => {
    const timestamp = new Date(x.timestamp);
    const timezoneOffsetInMinutes = new Date().getTimezoneOffset();
    timestamp.setMinutes(timestamp.getMinutes() - timezoneOffsetInMinutes);
    return {
      timestamp,
      power: Number(x.power_used),
    };
  });

  const powerUsageData = powerUsage ? preparePowerData(powerUsage) : [];

  const refresh = () => {
    getData();
    homeConfigGetData();
  };

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [deviceId])
  );

  return (
    <DataBoundary
      loading={loading || homeConfigLoading}
      error={error || homeConfigError}
      data={data && homeConfigData}
      onPressRetry={refresh}
    >
      <ScrollView style={{ flex: 1 }} refreshControl={<RefreshControl refreshing={false} onRefresh={refresh} />}>
        {data && homeConfigData && (
          <SafeAreaView style={[styles.container, { height: dimensions.height - 157 }]}>
            <View style={styles.innerContainer}>
              <View style={styles.textContainer}>
                <StatusLabel status={data.status} />
                <ServiceLabel dr_status={data.dr_status} />
              </View>
              <Text style={[typography.label, styles.graphLabel]}>Power Usage (Today)</Text>
              <PowerUsageGraph data={powerUsageData} />
              {shouldPresentDemandResponse(data.dr_status) && (
                <View style={styles.demandResponse}>
                  <ConditionalDemandResponse
                    drStatus={data.dr_status}
                    onPress={() =>
                      navigation.navigate("DemandResponseMessage", {
                        title: demandRespondTitle,
                        showOptOutButton: true,
                        deviceId,
                      })
                    }
                  />
                </View>
              )}
            </View>
          </SafeAreaView>
        )}
      </ScrollView>
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
  textContainer: {
    padding: theme.padding,
  },
  demandResponse: {
    marginTop: "auto",
    paddingHorizontal: theme.padding,
    paddingVertical: theme.padding,
  },
  graphLabel: {
    marginBottom: theme.padding,
    paddingHorizontal: theme.padding,
    textAlign: "right",
  },
});
