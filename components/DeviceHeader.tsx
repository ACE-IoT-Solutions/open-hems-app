import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme, typography } from "../theme";
import User from "../assets/svg/user.svg";
import { TouchableOpacity } from "react-native-gesture-handler";

type DeviceHeaderProps = {
  deviceName: string;
  onPressAccount: () => void;
};

export function DeviceHeader({ deviceName, onPressAccount }: DeviceHeaderProps) {
  return (
    <View testID="DeviceHeader" style={styles.headerContainer}>
      <Text style={styles.deviceNameLabel} maxFontSizeMultiplier={3}>
        {deviceName}
      </Text>
      <TouchableOpacity onPress={onPressAccount}>
        <User />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.padding,
    paddingHorizontal: theme.padding,
  },
  deviceNameLabel: {
    ...typography.headline2,
    color: theme.text,
  },
});
