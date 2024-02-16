import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { capitalize } from "lodash";
import { ThermostatMode } from "../../types";
import { typography, colors, theme } from "../../theme";

import { ThermostatModePickerItem } from "./ThermostatModePickerItem";
import { ThermostatModePickerData } from "./ThermostatModePickerItem";
import ChevronDown from "../../assets/svg/chevron-down.svg";

type ThermostatModePickerProps = {
  options: ThermostatModePickerData[];
  selectedMode: ThermostatMode;
  onChange(mode: ThermostatMode): void;
};

export const ThermostatModePicker = ({ options, selectedMode, onChange }: ThermostatModePickerProps) => {
  const [isToggled, setIsToggled] = useState<boolean>(false);

  const selectedOption = options.find((option) => option.mode === selectedMode);
  const offsetTop = -(options.length * 50); // the picker items are at minimum 50dp in height

  function handleOnChange(item: ThermostatModePickerData) {
    const { mode } = item;

    setIsToggled(false);
    onChange(mode);
  }

  return (
    <View style={styles.container}>
      {isToggled && (
        <View style={[styles.options, { top: offsetTop }]}>
          {options.map((item, i) => (
            <ThermostatModePickerItem
              key={i}
              icon={item.icon}
              label={item.mode}
              isSelected={selectedOption?.mode === item.mode}
              onPress={() => handleOnChange(item)}
            />
          ))}
        </View>
      )}
      <TouchableOpacity
        testID="ThermostatModePicker"
        activeOpacity={1}
        style={styles.wrapper}
        onPress={() => setIsToggled(!isToggled)}
      >
        <View style={styles.mode}>
          {selectedMode !== "off" && <View style={styles.inlineIcon}>{selectedOption?.icon}</View>}
          <Text testID="ThermostatModePicker-selected-label" style={styles.label} maxFontSizeMultiplier={2}>
            {capitalize(selectedMode)}
          </Text>
        </View>
        <View style={[styles.icon, isToggled && styles.rotatedIcon]}>
          <ChevronDown />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  options: {
    zIndex: 1,
    position: "absolute",
    width: "100%",
  },
  wrapper: {
    position: "relative",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.backdrop,
    paddingVertical: theme.padding,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: colors.lightBlue,
    shadowRadius: 1,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowColor: colors.darkBlue15pct,
    elevation: 3,
  },
  label: {
    ...typography.headline3,
  },
  mode: {
    flexDirection: "row",
    alignItems: "center",
  },
  modeIcon: {
    marginRight: theme.padding / 2,
  },
  icon: {
    position: "absolute",
    right: theme.padding,
  },
  rotatedIcon: {
    transform: [{ rotate: "180deg" }],
  },
  inlineIcon: {
    marginRight: theme.padding / 1.5,
  },
});
