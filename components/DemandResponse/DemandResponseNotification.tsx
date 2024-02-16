import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { theme } from "../../theme";
import Help from "../../assets/svg/help.svg";

type DemandResponseNotificationProps = { onPress: () => void };

export function DemandResponseNotification({ onPress }: DemandResponseNotificationProps) {
  return (
    <TouchableOpacity testID="DemandResponseNotification" style={styles.container} onPress={onPress}>
      <Help style={styles.icon} />
      <Text style={styles.label} maxFontSizeMultiplier={1.6}>
        Adjusted for Power Efficiency
      </Text>
      <Text style={styles.cta} maxFontSizeMultiplier={1.6}>
        View
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 45,
    paddingVertical: theme.padding / 2,
    backgroundColor: theme.primary,
    borderRadius: 22,
  },
  icon: {
    marginHorizontal: theme.padding,
    marginRight: "auto",
  },
  label: {
    color: theme.colors.white,
    fontFamily: theme.fonts.title,
    textAlign: "center",
    maxWidth: "70%",
  },
  cta: {
    fontFamily: theme.fonts.title,
    color: theme.colors.white,
    textDecorationColor: theme.colors.white,
    textDecorationLine: "underline",
    marginLeft: "auto",
    marginRight: theme.padding * 2,
  },
});
