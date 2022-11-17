import React from "react";
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import Phone from "../assets/svg/phone.svg";
import Welcome from "../assets/svg/welcome.svg";
import Mail from "../assets/svg/mail.svg";
import ArrowUp from "../assets/svg/chevron-up-solid_2.svg";
import User from "../assets/svg/user.svg";
import { DismissableSwipeResponder } from "../components/DismissableSwipeResponder";
import { theme } from "../theme";
import { NavigationActions } from "react-navigation";
import { useNavigation } from "@react-navigation/native";
import { MainNavigationProps } from "../types/navigation";

export function WelcomeScreen() {
  const navigation = useNavigation<MainNavigationProps>();

  function navigateToOptions() {
    navigation.navigate(
      "Options",
      {},
      NavigationActions.navigate({
        routeName: "Options",
      })
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <DismissableSwipeResponder>
        <View style={styles.titleContainer}>
          <Welcome width={200} height={200} />
        </View>

        <View style={styles.textContainer}>
          <Text style={{ fontSize: 35, color: "white", fontWeight: "bold" }}>Welcome</Text>

          <View style={styles.divider} />

          <View>
            <Text style={styles.descriptionText}>
              The Connecting MHA app allows participants in the program to view, manage and override their smart home
              devices. The app works only with the Connecting MHA program and users are given more details and
              instructions for use upon enrollment.
            </Text>
            <Text style={styles.descriptionText}>
              If you have any questions, concerns, or are having trouble during an{" "}
              <Text style={{ fontWeight: "bold" }}> Energy Savings Event</Text> contact us via phone or email.
            </Text>
          </View>

          <View style={styles.contactContainer}>
            <Text style={styles.contactLabelContainer}>The Connecting MHA Team</Text>
            <View style={styles.contactRowContainer}>
              <Phone width={30} height={30} fill="red" />
              <Text style={styles.contactInfoText}>(629) 256-5894</Text>
            </View>
            <View style={styles.contactRowContainer}>
              <Mail width={30} height={30} fill="red" />
              <Text style={styles.contactInfoText}>info@connecting-mha.com</Text>
            </View>
          </View>

          <View style={styles.swipeContainer}>
            <ArrowUp width={30} height={30} />
            <Text style={[styles.swipeText, { paddingTop: 5 }]}>Swipe up to continue</Text>
          </View>
        </View>
      </DismissableSwipeResponder>
      <TouchableOpacity onPress={navigateToOptions} style={styles.settingButton}>
        <User />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  titleContainer: {
    marginTop: -45,
    marginBottom: -20,
    alignItems: "center",
  },
  textContainer: {
    flex: 7,
    marginTop: -20,
    paddingTop: 30,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "rgb(32, 140, 227)",
  },
  descriptionText: {
    fontSize: 15,
    color: theme.colors.white,
    paddingTop: 20,
    lineHeight: 20,
  },
  divider: {
    paddingTop: 20,
    borderBottomColor: theme.colors.white,
    borderBottomWidth: 1,
  },
  contactContainer: {
    flexDirection: "column",
    height: 180,
    marginTop: 20,
    padding: 25,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.white,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  contactLabelContainer: {
    fontSize: 15,
    fontWeight: "bold",
    color: theme.colors.white,
    marginBottom: 20,
  },
  contactRowContainer: {
    marginBottom: 20,
    alignItems: "flex-start",
    flexDirection: "row",
  },
  contactInfoText: {
    fontSize: 15,
    paddingLeft: 10,
    paddingTop: 5,
    color: theme.colors.white,
  },
  swipeContainer: {
    alignItems: "center",
    marginTop: 30,
  },
  swipeText: {
    fontSize: 15,
    color: theme.colors.white,
  },
  settingButton: {
    position: "absolute",
    top: 40,
    right: 20,
  },
});
