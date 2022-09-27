import React from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import Phone from "../assets/svg/phone.svg";
import Wifi from "../assets/svg/wifi.svg";
import Mail from "../assets/svg/mail.svg";
import ArrowUp from "../assets/svg/arrow-up.svg";

export function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={{ flex: 1, marginBottom: -20, fontSize: 30, marginLeft: 100, fontWeight: "bold" }}>
          connecting
        </Text>
        <View style={{ flex: 1, maxWidth: 140, marginLeft: 100, flexDirection: "row", justifyContent: "space-between" }}>
          <Wifi width={45} height={45}/>
          <Text style={{ marginTop: -8, fontSize: 55, fontWeight: "bold" }}>
            MHA
          </Text>
        </View>
      </View>

      {/* Text */}
      <View style={styles.textContainer}>
        {/* Welcome */}
        <Text style={{ fontSize: 35, color: "white", fontWeight: "bold" }}>
          Welcome
        </Text>

        {/* Divider */}
        <View
          style={{
            paddingTop: 20,
            borderBottomColor: "white",
            borderBottomWidth: 1
          }}
        />

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={[styles.text, {lineHeight: 20}]}>
            This app is designed to help you manage your new smart devices, just
            click on the tab below to access the device you want to control.
          </Text>
          <Text style={[styles.text, {paddingTop: 15, lineHeight: 20}]}>
            If you have any questions or concerns with your devices, or are
            having trouble during an{" "}
            <Text style={{ fontWeight: "bold" }}> Energy Savings Event</Text>,
            contact us via phone or email:
          </Text>
        </View>

        {/* Contact */}
        <View style={styles.contactContainer}>
          <Text style={[styles.text, {flex: 1, fontWeight: "bold", marginBottom: -50}]}>
            The Connecting MHA Team
          </Text>
          <View style={{flexDirection: "column", flex: 1}}>
            <View style={styles.rowContainer}>
              <Phone width={30} height={30}/>
              <Text style={[styles.text, {paddingLeft: 10, paddingTop: 5}]}>
                (629) 256-5894
              </Text>
            </View>
            
            <View style={styles.rowContainer}>
              <Mail width={30} height={30}/>
              <Text style={[styles.text, {paddingLeft: 10, paddingTop: 5}]}>
                info@connecting-mha.com
              </Text>
            </View>
          </View>
        </View>

        
        {/* Swipe Gesture Button */}
        <View style={{alignItems: "center", marginTop: 20}}>
          <ArrowUp width={30} height={30}/>
          <Text style={[styles.text, {paddingTop: 20}]}>
            Swipe up to remove this homepage
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  titleContainer: {
    flex: 1,
    paddingTop: 10,
  },
  textContainer: {
    flex: 7,
    marginTop: 20,
    paddingTop: 30,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "rgb(32, 140, 227)"
  },
  descriptionContainer: {
    paddingTop: 20,
  },
  text: {
    fontSize: 15,
    color: "white"
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
    backgroundColor: "rgba(255,255,255,0.15)"
  },
  rowContainer: {
    flex: 1,
    maxWidth: 200, 
    marginBottom: 10,
    alignItems: "flex-start",
    flexDirection: "row", 
  }
});
