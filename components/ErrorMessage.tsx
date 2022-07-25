import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme, typography } from "../theme";
import { Button } from "./Button";
import WifiOffSvg from "../assets/svg/wifi-off.svg";

type ErrorMessageProps = {
  title?: string;
  errorMessage?: string;
  onPressRetry?: () => void;
  onPressSettings?: () => void;
};

export function ErrorMessage({ title, errorMessage, onPressRetry, onPressSettings }: ErrorMessageProps) {
  return (
    <View testID="ErrorMessage" style={styles.container}>
      <View style={styles.content}>
        <WifiOffSvg style={styles.icon} />
        <Text style={styles.title}>{title ?? "Something went wrong"}</Text>
        <Text style={styles.errorSummary}>
          {errorMessage ?? "Looks like we couldn't load this device. Try reloading."}
        </Text>
        {onPressRetry && (
          <View style={styles.reloadButton}>
            <Button label="Try Again" onPress={() => onPressRetry()} />
          </View>
        )}
        {onPressSettings && (
          <View style={styles.settingsButton}>
            <Button label="Settings" onPress={() => onPressSettings()} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    paddingHorizontal: theme.padding,
    paddingVertical: 0,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },

  content: {
    width: "100%",
    flexBasis: "60%",
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
  settingsButton: {
    width: "100%",
    marginTop: theme.padding,
  },
});
