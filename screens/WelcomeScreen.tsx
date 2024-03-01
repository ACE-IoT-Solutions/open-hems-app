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
import { GestureHandlerRootView } from "react-native-gesture-handler";

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
    <DismissableSwipeResponder>
      <SafeAreaView style={styles.container}>
        <View style={styles.svgContainer}>
          <Welcome width={200} height={120} />
        </View>

        <View style={styles.textContainer}>
          <Text style={{ fontSize: 35, color: "white", fontWeight: "bold" }}>Welcome</Text>

          <View style={styles.divider} />

          <View>
            <Text style={styles.descriptionText}>
              This app is designed to help you manage your new smart devices, just click on the tab below to access the
              device you want to control.
            </Text>
            <Text style={styles.descriptionText}>
              If you have any questions or concerns with your devices, or are having trouble during a
              <Text style={{ fontWeight: "bold" }}> Smart Energy Event</Text>, contact us via phone or email:
            </Text>
          </View>

          <View style={styles.contactContainer}>
            <Text style={styles.contactLabelContainer}>The Connecting MHA Team</Text>
            <View style={styles.contactRowContainer}>
              <Phone width={30} height={30} />
              <Text style={styles.contactInfoText}>(629) 256-5894</Text>
            </View>
            <View style={styles.contactRowContainer}>
              <Mail width={30} height={30} />
              <Text style={styles.contactInfoText}>info@connecting-mha.com</Text>
            </View>
          </View>

          <View style={styles.swipeContainer}>
            <ArrowUp width={30} height={30} />
            <Text style={[styles.swipeText, { paddingTop: 5 }]}>Swipe up to continue</Text>
          </View>
        </View>
      </SafeAreaView>
      <TouchableOpacity onPress={navigateToOptions} style={styles.settingButton}>
        <User />
      </TouchableOpacity>
    </DismissableSwipeResponder>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  svgContainer: {
    flex: 1,
    alignItems: "center",
  },
  textContainer: {
    flex: 5.5,
    paddingHorizontal: 40,
    paddingVertical: 25,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "rgb(32, 140, 227)",
  },
  divider: {
    marginVertical: 20,
    borderBottomColor: theme.colors.white,
    borderBottomWidth: 1,
  },
  descriptionText: {
    fontSize: 15,
    color: theme.colors.white,
    paddingBottom: 25,
    lineHeight: 20,
  },
  contactContainer: {
    flexDirection: "column",
    height: 180,
    paddingHorizontal: 30,
    paddingVertical: 25,
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
    flexWrap: "wrap",
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
    top: 50,
    right: 10,
  },
});
