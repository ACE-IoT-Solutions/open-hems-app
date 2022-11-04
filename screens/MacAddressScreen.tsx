import React, { useState } from "react";
import { Text, View, StyleSheet, SafeAreaView, Modal } from "react-native";
import { theme } from "../theme";
import { Button } from "../components/Button";
import { setJwt, getApiEndpoint } from "../utils/api";
import { useNavigation } from "@react-navigation/native";
import { MainNavigationProps } from "../types/navigation";
import { NavigationActions } from "react-navigation";
import { FIRST_SECRET } from "../constants/api.constants";
import sign from "jwt-encode";
import { TextInputMask } from "react-native-masked-text";

export function MacAddressScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
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

  async function verify() {
    console.log(macAddress);
    const data = { authorized: true };
    const secret = sign(data, FIRST_SECRET + macAddress);
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
        setIsVerified(false);
        setIsModalVisible(true);
        console.log("Verify Failure");
      } else {
        const data = await response.json();
        setJwt(data["jwt"]);
        setIsVerified(true);
        console.log("Verify Success");
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  async function signOut() {
    setIsVerified(false);
    setJwt("INVALID_TOKEN");
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
      <Text style={styles.titleText}>Enter your mac address</Text>
      <View style={styles.inputTextContainer}>
        <TextInputMask
          value={macAddress}
          type={"custom"}
          placeholder="__:__:__:__:__:__"
          options={{ mask: "SS:SS:SS:SS:SS:SS" }}
          onChangeText={(text) => setMacAddress(text.replaceAll(":", "").toLowerCase())}
          style={styles.inputText}
          maxLength={17}
        />
      </View>
      {isVerified ? (
        <Button label="Enter" style={styles.enterButton} onPress={navigateToHome} />
      ) : (
        <Button label="Verify" style={styles.verifyButton} onPress={verify} />
      )}
      <ErrorModal />
      <Button label="Sign Out" style={styles.verifyButton} onPress={signOut} />
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
  titleText: {
    fontSize: 18,
    padding: 20,
  },
  inputTextContainer: {
    flex: 1,
    flexDirection: "row",
    maxHeight: 50,
    maxWidth: 210,
    marginBottom: 10,
  },
  inputText: {
    flex: 1,
    borderRadius: 10,
    marginBottom: 0,
    fontSize: 18,
    textAlign: "center",
    backgroundColor: theme.colors.white,
  },
  verifyButton: {
    height: 50,
    width: 210,
    marginVertical: 10,
    borderRadius: 30,
  },
  enterButton: {
    height: 50,
    width: 210,
    marginVertical: 10,
    borderRadius: 30,
    backgroundColor: "rgb(54, 234, 98)",
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
