import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme, typography } from "../theme";
import AlertSvg from "../assets/svg/alert.svg";

export function ErrorScreen() {
  return (
    <View style={styles.container}>
      <AlertSvg style={styles.icon} />
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.errorSummary}>An error occurred from which we couldn't recover. Please restart the app.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    paddingHorizontal: theme.padding,
    paddingVertical: theme.padding,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  icon: {
    margin: theme.padding * 2,
  },
  title: {
    ...typography.headline3Bold,
  },
  errorSummary: {
    ...typography.headline3,
    maxWidth: 300,
    textAlign: "center",
    padding: theme.padding * 2,
    lineHeight: 26,
  },
  reloadButton: {
    width: "100%",
  },
});
