import React, { useState } from "react";
import { Text, View, StyleSheet, SafeAreaView, Modal, TouchableOpacity } from "react-native";
import { theme } from "../theme";
import { Button } from "../components/Button";
import { setJwt, getApiEndpoint, setStorageMacAddress } from "../utils/api";
import { useNavigation } from "@react-navigation/native";
import { MainNavigationProps } from "../types/navigation";
import { NavigationActions } from "react-navigation";
import { FIRST_SECRET } from "../constants/api.constants";
import sign from "jwt-encode";
import { TextInputMask } from "react-native-masked-text";
import User from "../assets/svg/user.svg";

export function MacAddressScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [macAddress, setMacAddress] = useState<string>("001122334455");
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

  function navigateToOptions() {
    navigation.navigate(
      "Options",
      {},
      NavigationActions.navigate({
        routeName: "Options",
      })
    );
  }

  async function verify() {
    // console.log("macAddress", macAddress);
    const data = { authorized: true };
    const secret = sign(data, FIRST_SECRET + macAddress);
    await setStorageMacAddress(macAddress);
    try {
      const url = await getApiEndpoint();
      const endpoint = "/hems/generate_new_jwt";

      const response = await fetch(url + endpoint, {
        method: "POST",
        body: JSON.stringify({
          jwt: secret,
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (response.status !== 200) {
        setJwt("INVALID_TOKEN");
        setIsModalVisible(true);
        // console.log("Verify Failure");
      } else {
        const data = await response.json();
        setJwt(data["jwt"]);
        // console.log("Verify Success");
        navigateToHome();
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  function toggleModal() {
    setIsModalVisible(!isModalVisible);
  }

  function ErrorModal() {
    return (
      <Modal transparent={true} visible={isModalVisible}>
        <View style={styles.errorModal}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorMessage}>Invalid Mac Address</Text>
            <Button style={styles.errorButton} label="Try Again" onPress={toggleModal} />
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={navigateToOptions} style={styles.settingButton}>
        <User />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <View style={styles.labelTextContainer}>
          <Text style={styles.labelText}>Find your 12-character mac address from your gateway and enter it below</Text>
        </View>
        <TextInputMask
          style={styles.inputText}
          value={macAddress}
          type={"custom"}
          placeholder="__:__:__:__:__:__"
          options={{ mask: "SS:SS:SS:SS:SS:SS" }}
          onChangeText={(newMacAddress) => setMacAddress(newMacAddress.replace(/[^a-zA-Z\d]+/g, "").toLowerCase())}
          maxLength={17}
        />
      </View>
      <Button label="Verify" style={styles.verifyButton} onPress={verify} />
      <ErrorModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    maxHeight: 300,
    maxWidth: 300,
    marginTop: 200,
    marginHorizontal: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.backdrop,
  },
  settingButton: {
    paddingBottom: 10,
  },
  textContainer: {
    flex: 1,
    flexDirection: "column",
    maxHeight: 150,
    maxWidth: 210,
    marginBottom: 10,
  },
  labelTextContainer: {
    flex: 1,
    height: 150,
    width: 210,
    marginBottom: 20,
  },
  labelText: {
    fontSize: 17,
    lineHeight: 23,
  },
  inputText: {
    flex: 1,
    fontSize: 20,
    borderRadius: 10,
    textAlign: "center",
    backgroundColor: theme.colors.white,
  },
  verifyButton: {
    height: 50,
    width: 210,
    marginVertical: 10,
    borderRadius: 30,
  },
  errorModal: {
    flex: 1,
    backgroundColor: "#000000aa",
  },
  errorContainer: {
    marginTop: 270,
    marginHorizontal: 50,
    padding: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  errorMessage: {
    fontSize: 18,
  },
  errorButton: {
    marginTop: 20,
    width: 180,
    borderRadius: 50,
  },
});
