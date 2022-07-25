import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme, typography } from "../theme";

export function StyleGuideScreen() {
  return (
    <View style={styles.container}>
      <Text style={{ ...typography.headline1, ...styles.exampleText }}>Headline 1</Text>
      <Text style={{ ...typography.headline2, ...styles.exampleText }}>Headline 2</Text>
      <Text style={{ ...typography.headline3, ...styles.exampleText }}>Headline 3</Text>
      <Text style={{ ...typography.headline3Bold, ...styles.exampleText }}>Headline 3 Bold</Text>
      <Text style={{ ...typography.label, ...styles.exampleText }}>Label</Text>
      <Text style={{ ...typography.text, ...styles.exampleText }}>Text</Text>
      <Text style={{ ...typography.errorText, ...styles.exampleText }}>Error Text</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    padding: 10,
  },

  exampleText: {
    marginVertical: 5,
  },
});
