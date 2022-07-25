import React, { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";
import { theme, typography } from "../theme";
import { Button } from "../components/Button";
import { HomeBatteryUpdateReserveLimitScreenRouteProp, DeviceNavigationProps } from "../types";
import { useDeviceUpdateDerStatus, useHomeBatteryUpdateReserveLimit } from "../hooks/api";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ErrorLabel } from "../components/ErrorLabel";
import { OptOutModal } from "../components/OptOutModal";

export function ReserveLimitScreen() {
  const navigation = useNavigation<DeviceNavigationProps>();
  const route = useRoute<HomeBatteryUpdateReserveLimitScreenRouteProp>();
  const { deviceId, reserveLimit: initialReserveLimit, showOptOutModal } = route.params;

  const [reserveLimit, setReserveLimit] = useState(initialReserveLimit);
  const { update, loading, error } = useHomeBatteryUpdateReserveLimit(deviceId);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const {
    update: updateDrStatus,
    loading: updateDrStatusLoading,
    error: updateDrStatusError,
  } = useDeviceUpdateDerStatus(deviceId);

  const updateReserveLimit = async () => {
    const response = await update({ reserve_limit: reserveLimit });

    if (response.success) {
      navigation.goBack();
    }
  };

  const submitReserveLimit = () => {
    if (reserveLimit === initialReserveLimit) {
      navigation.goBack();
      return;
    }

    if (showOptOutModal) {
      setModalVisible(true);
      return;
    }

    updateReserveLimit();
  };

  async function confirmModal() {
    await updateDrStatus({ status: "opted_out" });
    updateReserveLimit();
  }

  function cancelModal() {
    setModalVisible(false);
    setReserveLimit(initialReserveLimit);
  }

  const reserveLimitButtons = [0, 20, 40, 60, 80, 100].map((i) => (
    <TouchableOpacity
      key={`SetReserveLimit${i}`}
      onPress={() => setReserveLimit(i)}
      accessibilityLabel={String(i)}
      accessibilityRole="button"
      accessibilityState={{ selected: reserveLimit === i }}
    >
      <View style={[styles.button, reserveLimit === i ? styles.focusedButton : {}]}>
        <Text style={[typography.label, reserveLimit === i ? styles.focusedButtonText : {}]}>{i}</Text>
      </View>
    </TouchableOpacity>
  ));

  return (
    <>
      <View style={styles.container}>
        <View style={styles.center}>
          <Text style={typography.label}>Adjust the limit of energy stored for your battery</Text>
          <View style={styles.buttonContainer}>{reserveLimitButtons}</View>
        </View>

        <View>
          <Button
            accessibilityLabel="Submit"
            activity={loading || updateDrStatusLoading}
            label="Set Limit"
            onPress={submitReserveLimit}
          />
          {(error || updateDrStatusError) && <ErrorLabel message="Failed to update reserve limit" />}
        </View>
      </View>
      <OptOutModal
        message="Charging at this rate adds a burden on the system and could negatively impact the environment."
        visible={modalVisible}
        onPressGoBack={cancelModal}
        onPressConfirm={confirmModal}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: theme.background,
    marginHorizontal: theme.padding,
  },

  center: {
    marginVertical: theme.padding,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 6 * theme.padding + 180,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },

  button: {
    width: 60,
    paddingHorizontal: theme.padding,
    paddingVertical: theme.padding / 2,
    margin: theme.padding,
    backgroundColor: theme.backdrop,
    borderRadius: 8,
    borderColor: theme.backdrop,
    borderWidth: 1,
    alignItems: "center",
  },

  focusedButton: {
    backgroundColor: theme.primary,
  },

  focusedButtonText: {
    color: theme.colors.white,
  },

  error: {
    ...typography.errorText,
    textAlign: "center",
    margin: theme.padding,
  },
});
