import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { theme, typography } from "../../theme";
import AlertCircle from "../../assets/svg/alert-circle.svg";

export function OptedOutNotification() {
  return (
    <TouchableOpacity testID="OptedOutNotification" style={styles.container}>
      <AlertCircle style={styles.icon} />
      <Text style={styles.label} maxFontSizeMultiplier={1.6}>
        Standard operation has resumed
      </Text>
      <Text style={styles.cta}></Text>
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
    backgroundColor: theme.colors.periwinkle,
    borderRadius: 22,
  },
  icon: {
    marginHorizontal: theme.padding,
    marginRight: "auto",
  },
  label: {
    color: theme.primary,
    fontFamily: theme.fonts.title,
    paddingHorizontal: theme.padding,
    textAlign: "center",
    maxWidth: "60%",
  },
  cta: {
    marginLeft: "auto",
    marginRight: theme.padding * 2,
  },
});
