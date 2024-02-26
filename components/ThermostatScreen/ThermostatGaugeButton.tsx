import React, { ReactElement } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native";
import { SvgProps } from "react-native-svg";
import { theme, typography } from "../../theme";

type ThermostatGaugeButtonProps = {
  icon: ReactElement<SvgProps>;
  label: "Warm" | "Cool";
  disabled: boolean;
  onPress(): void;
};

export const ThermostatGaugeButton = ({ icon, label, disabled = false, onPress }: ThermostatGaugeButtonProps) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={disabled && styles.disabled}>
        <View style={styles.container}>{icon}</View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  disabled: {
    opacity: 0.629,
  },
});
