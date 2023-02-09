import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import { useHomeConfigData } from "../hooks/useHomeConfigData";
import { theme, typography } from "../theme";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Button } from "../components/Button";
import { DemandResponseScreenRouteProps } from "../types";
import { useDeviceUpdateDerStatus } from "../hooks/api";
import { ErrorLabel } from "../components/ErrorLabel";
import { DataBoundary } from "../components/DataBoundary";

export function DemandResponseMessageScreen() {
  const { data, error, loading, getData } = useHomeConfigData();
  const [optedOut, setOptedOut] = useState<boolean>(false);
  const navigation = useNavigation();

  const route = useRoute<DemandResponseScreenRouteProps>();
  const { deviceId, showOptOutButton } = route.params;
  const { update, error: updateError, loading: updateLoading } = useDeviceUpdateDerStatus(deviceId);

  const message = data?.lpc_config.current_event_message.message;
  const refresh = getData;

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (!optedOut) {
      return;
    }

    const optOut = async () => {
      const response = await update({ status: "opted_out" });

      if (response.success) {
        navigation.goBack();
      } else {
        setOptedOut(false);
      }
    };

    optOut();
  }, [optedOut]);

  return (
    <DataBoundary
      loading={loading}
      error={error}
      data={data}
      onPressRetry={refresh}
      errorMessage="We encountered an error while retrieving Demand Response data."
    >
      <SafeAreaView style={styles.container}>
        {data && (
          <View style={styles.content}>
            <View style={styles.textBlock}>
              <Text style={typography.headline2}>{message}</Text>
            </View>
            {updateError && <ErrorLabel message="Error Opting Out" />}
            <View style={{ marginVertical: theme.padding }}>
              {showOptOutButton && (
                <Button
                  label="Resume Normal Settings"
                  accessibilityLabel="Resume Normal Settings"
                  onPress={() => setOptedOut(true)}
                  style={{ backgroundColor: theme.colors.red }}
                  activity={updateLoading}
                />
              )}
            </View>
            <Button onPress={navigation.goBack} label="Close" />
          </View>
        )}
      </SafeAreaView>
    </DataBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    alignItems: "center",
  },
  content: {
    height: "100%",
    padding: theme.padding,
  },
  textBlock: {
    flex: 1,
    paddingTop: theme.padding,
  },
});
