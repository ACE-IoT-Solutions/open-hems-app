import React, { ReactElement } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
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
        <View style={styles.icon}>{icon}</View>
        <Text style={styles.label}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    ...typography.label,
  },
  disabled: {
    opacity: 0.629,
  },
  icon: {
    marginBottom: 10,
  },
  label: {
    color: theme.primary,
    textAlign: "center",
  },
});
