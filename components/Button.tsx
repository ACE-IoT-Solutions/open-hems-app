import React from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native";
import { theme, typography } from "../theme";

type ButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  activity?: boolean;
  accessibilityLabel?: string;
  testID?: string;
  style?: object;
};

export function Button({ accessibilityLabel, activity, disabled, label, onPress, testID, style }: ButtonProps) {
  return (
    <TouchableOpacity
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      style={[styles.button, style ?? {}, disabled && styles.disabled]}
      onPress={onPress}
      accessibilityRole="button"
      disabled={disabled}
    >
      {!activity && (
        <Text style={[typography.headline3Bold, styles.label]} allowFontScaling={false}>
          {label}
        </Text>
      )}
      {activity && <ActivityIndicator />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: theme.padding,
    backgroundColor: theme.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    color: theme.colors.white,
  },
});
