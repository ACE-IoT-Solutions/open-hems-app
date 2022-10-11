import React, { useContext } from "react";
import { Text, View, StyleSheet, SafeAreaView } from "react-native";
import Phone from "../assets/svg/phone.svg";
import Welcome from "../assets/svg/welcome.svg";
import Mail from "../assets/svg/mail.svg";
import ArrowUp from "../assets/svg/arrow-up.svg";
import { DismissableSwipeResponder } from "../components/DismissableSwipeResponder";

export function WelcomeScreen() {
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
              This app is designed to help you manage your new smart devices, just click on the tab below to access the
              device you want to control.
            </Text>
            <Text style={styles.descriptionText}>
              If you have any questions or concerns with your devices, or are having trouble during an
              <Text style={{ fontWeight: "bold" }}> Energy Savings Event</Text>, contact us via phone or email:
            </Text>
          </View>

          <View style={styles.contactContainer}>
            <Text style={styles.contactTitleContainer}>The Connecting MHA Team</Text>
            <View style={styles.contactRowContainer}>
              <Phone width={30} height={30} fill="red" />
              <Text style={styles.subText}>(629) 256-5894</Text>
            </View>
            <View style={styles.contactRowContainer}>
              <Mail width={30} height={30} fill="red" />
              <Text style={styles.subText}>info@connecting-mha.com</Text>
            </View>
          </View>

          <View style={styles.scrollContainer}>
            <ArrowUp width={30} height={30} />
            <Text style={[styles.text, { paddingTop: 5 }]}>Swipe up to continue</Text>
          </View>
        </View>
      </DismissableSwipeResponder>
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
    color: "white",
    paddingTop: 20,
    lineHeight: 20,
  },
  divider: {
    paddingTop: 20,
    borderBottomColor: "white",
    borderBottomWidth: 1,
  },
  text: {
    fontSize: 15,
    color: "white",
  },
  subText: {
    fontSize: 15,
    paddingLeft: 10,
    paddingTop: 5,
    color: "white",
  },
  contactContainer: {
    flex: 1,
    flexDirection: "column",
    maxHeight: 170,
    marginTop: 20,
    paddingTop: 20,
    paddingRight: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "white",
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  contactTitleContainer: {
    flex: 1,
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  contactRowContainer: {
    flex: 1,
    marginBottom: 10,
    alignItems: "flex-start",
    flexDirection: "row",
  },
  scrollContainer: {
    alignItems: "center",
    marginTop: 30,
  },
});
