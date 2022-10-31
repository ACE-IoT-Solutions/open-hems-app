import React, { useState } from "react";
import { Text, View, StyleSheet, SafeAreaView, TextInput } from "react-native";
import { theme } from "../theme";
import { Button } from "../components/Button";
import { sendSecret } from "../utils/api";
import { useNavigation } from "@react-navigation/native";
import { MainNavigationProps } from "../types/navigation";
import { NavigationActions } from "react-navigation";

export function MacAddressScreen() {
  const [macAddress, setMacAddress] = useState("001122334455");
  const navigation = useNavigation<MainNavigationProps>();

  function navigateToHome() {
    navigation.navigate(
      "AppNavigator",
      {},
      NavigationActions.navigate({
        routeName: "AppNavigator",
      })
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleText}>Enter your mac address</Text>
      <View style={styles.inputTextContainer}>
        <TextInput
          style={styles.inputText}
          placeholder="##:##:##:##:##:##"
          onChangeText={(newMacAddress) => setMacAddress(newMacAddress)}
          defaultValue={macAddress}
        />
        <Button label="Send" style={styles.sendButton} onPress={() => sendSecret(macAddress)} />
      </View>
      <Button label="Enter" style={styles.enterButton} onPress={navigateToHome} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    maxHeight: 200,
    maxWidth: 300,
    marginTop: 200,
    marginHorizontal: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.backdrop,
  },
  titleText: {
    fontSize: 18,
    padding: 20,
  },
  inputTextContainer: {
    flex: 1,
    flexDirection: "row",
    maxHeight: 50,
    maxWidth: 250,
  },
  inputText: {
    flex: 0.7,
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5,
    fontSize: 15,
    backgroundColor: theme.colors.white,
  },
  sendButton: {
    flex: 0.3,
    borderRadius: 10,
  },
  enterButton: {
    height: 50,
    width: 250,
    marginVertical: 10,
    borderRadius: 30,
  },
});
