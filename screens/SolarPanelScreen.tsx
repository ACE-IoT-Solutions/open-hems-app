import React, { useCallback } from "react";
import { useDeviceData } from "../hooks/useDeviceData";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { SolarPanelData, SolarPanelScreenRouteProps } from "../types";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { theme, typography } from "../theme";
import { StatusLabel } from "../components/StatusLabel";
import { EnergyGenerated } from "../components/SolarPanelScreen/EnergyGenerated";
import { EnergyGraph } from "../components/SolarPanelScreen/EnergyGraph";
import { preparePowerData } from "../utils/visualization";
import { DataBoundary } from "../components/DataBoundary";

export function SolarPanelScreen() {
  const route = useRoute<SolarPanelScreenRouteProps>();
  const { deviceId } = route.params;
  const { data, error, loading, getData } = useDeviceData<SolarPanelData>(deviceId, { initialFetch: false });
  const refresh = getData;

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [deviceId])
  );

  const generationSamples = data?.generation_samples?.map((x) => {
    const timestamp = new Date(x.timestamp);
    const timezoneOffsetInMinutes = new Date().getTimezoneOffset();
    timestamp.setMinutes(timestamp.getMinutes() - timezoneOffsetInMinutes);
    return {
      timestamp,
      power: Number(x.power_generated),
    };
  });

  const energyGraphData = generationSamples ? preparePowerData(generationSamples) : [];
  return (
    <DataBoundary loading={loading} error={error} data={data} onPressRetry={getData}>
      <ScrollView style={{ flex: 1 }} refreshControl={<RefreshControl refreshing={false} onRefresh={refresh} />}>
        {data && (
          <View style={styles.container}>
            <View>
              <View style={styles.textContainer}>
                <StatusLabel status={data.status} />
              </View>
              <View>
                <Text style={[typography.label, styles.textContainer, { textAlign: "right" }]}>
                  Power Generation (Today)
                </Text>
                <EnergyGraph data={energyGraphData} />
              </View>
              <View style={styles.textContainer}>
                <EnergyGenerated
                  energyGenerated={data.power_generated_this_month}
                  energySentToGrid={data.power_sent_to_grid_this_month}
                />
              </View>
            </View>
          </View>
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

  textContainer: {
    marginVertical: theme.padding,
    paddingHorizontal: theme.padding,
  },
});
