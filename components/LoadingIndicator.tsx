import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { theme } from "../theme";

export function LoadingIndicator() {
  return (
    <View testID="LoadingIndicator" style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    padding: theme.padding,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
});
