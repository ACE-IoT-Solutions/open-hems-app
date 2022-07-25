import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { theme } from "../../theme";
import AlertCircle from "../../assets/svg/alert-circle.svg";

export function OptedOutNotification() {
  return (
    <TouchableOpacity testID="OptedOutNotification" style={styles.container}>
      <AlertCircle style={styles.icon} />
      <Text style={styles.label}>You have opted out of demand response</Text>
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
  },
  cta: {
    marginLeft: "auto",
    marginRight: theme.padding * 2,
  },
});
