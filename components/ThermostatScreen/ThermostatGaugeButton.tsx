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
        <View style={styles.container}>
          <View>{icon}</View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.backdrop,
    justifyContent: "center",
    alignItems: "center",
    padding: 2.5,
    borderRadius: 20,
  },
  disabled: {
    opacity: 0.629,
  },
  label: {
    color: theme.primary,
    textAlign: "center",
  },
});
