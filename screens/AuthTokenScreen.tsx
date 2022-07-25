import React, { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Text, TextInput, StyleSheet, View } from "react-native";
import { Button } from "../components/Button";
import { theme, typography } from "../theme";
import { getJwt, setJwt } from "../utils/api";

export function AuthTokenScreen() {
  const [originalToken, setOriginalToken] = useState<string>();
  const [tokenDraft, setTokenDraft] = useState<string>();

  useFocusEffect(
    useCallback(() => {
      const grabToken = async () => {
        const jwt = await getJwt();
        setOriginalToken(jwt);
        setTokenDraft(jwt);
      };

      grabToken();
    }, [])
  );

  const saveJwt = () => {
    if (!tokenDraft) {
      return;
    }

    setJwt(tokenDraft);
    setOriginalToken(tokenDraft);
  };

  return (
    <View style={styles.container}>
      <Text style={typography.headline2}>Auth Token (JWT)</Text>
      <TextInput multiline onChangeText={setTokenDraft} style={styles.textInput} value={tokenDraft} />
      <Button onPress={saveJwt} label="Save" disabled={originalToken === tokenDraft} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.padding,
  },
  button: {
    paddingVertical: theme.padding,
    backgroundColor: theme.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    color: theme.colors.white,
  },
  textInput: {
    marginVertical: theme.padding,
    padding: theme.padding,
    backgroundColor: theme.colors.white,
    height: 200,
    ...typography.text,
    lineHeight: 32,
  },
});
