import React, { ReactElement } from "react";
import { TouchableOpacity, View, Text, StyleSheet, Platform } from "react-native";
import { ThermostatMode } from "../../types";
import { typography, colors, theme } from "../../theme";
import { capitalize } from "lodash";
import CheckMark from "../../assets/svg/checkmark.svg";

export type ThermostatModePickerData = {
  mode: ThermostatMode;
  icon?: ReactElement;
};

type ThermostatModePickerItemProps = {
  label: string;
  icon?: ReactElement;
  isSelected?: boolean;
  onPress(): void;
};

export const ThermostatModePickerItem = ({
  label,
  icon,
  isSelected = false,
  onPress,
}: ThermostatModePickerItemProps) => {
  return (
    <TouchableOpacity testID="ThermostatModePickerItem" style={styles.container} activeOpacity={1} onPress={onPress}>
      <View testID="ThermostatModePickerItem-icon-container" style={styles.icon}>
        {icon || <View testID="ThermostatModePickerItem-spacer" style={styles.spacer} />}
      </View>
      <Text testID="ThermostatModePickerItem-label" style={styles.label}>
        {capitalize(label)}
      </Text>
      {isSelected && (
        <View style={styles.iconContainer}>
          <CheckMark />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.white,
    paddingVertical: theme.padding,
    paddingHorizontal: theme.padding,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderBottomWidth: Platform.OS === "android" ? 0.25 : undefined,
    borderColor: colors.darkBlue15pct,
    zIndex: -1,
    minHeight: 50,
  },
  icon: {
    marginRight: theme.padding,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    transform: [{ scale: 1.05 }],
  },
  label: {
    ...typography.headline3,
    flex: 1,
  },
  spacer: {
    width: 24,
    height: 15,
  },
});
