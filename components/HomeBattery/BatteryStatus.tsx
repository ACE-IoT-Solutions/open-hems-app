import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { formatBatteryStatus, formatPercentage } from "../../utils/formatters";
import { ChargeRate, DeviceStatus, Percentage } from "../../types";
import { typography } from "../../theme";
import BatteryChargingIcon from "../../assets/svg/battery-charging.svg";
import BatteryOffIcon from "../../assets/svg/battery-off.svg";

type BatteryStatusProps = {
  status: DeviceStatus;
  chargeRate: ChargeRate;
  chargePercentage: Percentage;
};

const batteryStatusIcon: Record<DeviceStatus, React.FC> = {
  active: BatteryChargingIcon,
  inactive: BatteryOffIcon,
};

export const BatteryStatus = ({ status, chargeRate, chargePercentage }: BatteryStatusProps) => {
  const Icon = batteryStatusIcon[status];

  return (
    <View testID="BatteryStatus" style={{ flexDirection: "row", alignContent: "center", alignItems: "center" }}>
      <Icon />
      <Text style={styles.label}>
        {formatBatteryStatus(status, chargeRate)} ({formatPercentage(chargePercentage)})
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    paddingHorizontal: 3,
    ...typography.label,
  },
});
