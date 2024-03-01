import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Switch, ActivityIndicator } from "react-native";
import { theme, typography } from "../theme";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AppRouteName, AppRouteProps, DemandResponseStatus } from "../types";
import { useHemsData, useHemsUpdateDerStatus } from "../hooks/api";
import { ErrorLabel } from "../components/ErrorLabel";
import { getApiEndpoint, getJwt, getStorageMacAddress, isDevEnv } from "../utils/api";

function ApiEndpointButton() {
  const [endpoint, setEndpoint] = useState<string>();
  const navigation = useNavigation<AppRouteProps>();

  useFocusEffect(() => {
    const getEndpoint = async () => {
      const endpoint = await getApiEndpoint();

      if (endpoint) {
        setEndpoint(endpoint);
      }
    };

    getEndpoint();
  });

  return (
    <>
      {isDevEnv ? (
        <TouchableOpacity onPress={() => navigation.navigate("SettingsScreen")}>
          <View style={styles.cell}>
            <Text style={styles.cellTitle}>HEMS API Endpoint</Text>
            <Text style={typography.label}>{endpoint}</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.cell}>
          <Text style={styles.cellTitle}>HEMS API Endpoint</Text>
          <Text style={typography.label}>{endpoint}</Text>
        </View>
      )}
    </>
  );
}

function JwtButton() {
  const [jwt, setJwt] = useState<string>();
  const navigation = useNavigation<AppRouteProps>();

  useFocusEffect(() => {
    const getLocalJwt = async () => {
      setJwt(await getJwt());
    };

    getLocalJwt();
  });

  return (
    <>
      {isDevEnv ? (
        <TouchableOpacity onPress={() => navigation.navigate("AuthTokenScreen")}>
          <View style={styles.cell}>
            <Text style={styles.cellTitle}>Authentication Token (JWT)</Text>
            <Text style={typography.label}>{jwt}</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.cell}>
          <Text style={styles.cellTitle}>Authentication Token (JWT)</Text>
          <Text style={typography.label}>{jwt}</Text>
        </View>
      )}
    </>
  );
}

function MacAddressButton() {
  const [macAddress, setMacAddress] = useState<string>();
  const navigation = useNavigation<AppRouteProps>();

  useFocusEffect(() => {
    const getLocalMacAddress = async () => {
      setMacAddress(await getStorageMacAddress());
    };

    getLocalMacAddress();
  });

  return (
    <TouchableOpacity onPress={() => navigation.navigate("MacAddress")}>
      <View style={styles.cell}>
        <Text style={styles.cellTitle}>Mac Address</Text>
        <Text style={typography.label}>{macAddress}</Text>
      </View>
    </TouchableOpacity>
  );
}

function ViewWelcomeScreenButton() {
  const navigation = useNavigation<AppRouteProps>();

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("WelcomeScreen", { screen: "WelcomeScreen", initial: false, Animation: false })
      }
    >
      <View style={styles.cell}>
        <Text style={styles.cellTitle}>Welcome Screen</Text>
      </View>
      {/* <ScreenLink title="View Welcome Screen" screenName="WelcomeScreen" /> */}
    </TouchableOpacity>
  );
}

function DemandResponseToggle() {
  const { data, error, loading, getData } = useHemsData();
  const { update, error: updateError, loading: updateLoading } = useHemsUpdateDerStatus(data?.id ?? "");

  const selectDemandResponse = (status: DemandResponseStatus): boolean => status != "normal";
  const demandResponseActive = selectDemandResponse(data?.dr_status ?? "normal");

  const toggleDemandResponse = () => {
    const prepareDemandResponse = (demandResponseActive: boolean): DemandResponseStatus =>
      demandResponseActive ? "curtailed" : "normal";
    const newDemandResponse = prepareDemandResponse(!demandResponseActive);

    update({ status: newDemandResponse }).then(getData);
  };

  const errorMessage = [error && "Data fetch failed", updateError && "Data update failed"].filter((x) => x)[0];

  return (
    <TouchableOpacity disabled={!data} onPress={toggleDemandResponse}>
      <View style={[styles.cell, styles.alignRow]}>
        <View>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.cellTitle}>Demand Response Active</Text>
            {(loading || updateLoading) && <ActivityIndicator />}
          </View>
          {errorMessage && <ErrorLabel message={errorMessage} style={typography.smallErrorText} />}
        </View>
        <Switch disabled={!data} value={demandResponseActive} onValueChange={toggleDemandResponse} />
      </View>
    </TouchableOpacity>
  );
}

type ScreenLinkProps = {
  title: string;
  screenName: AppRouteName;
};

function ScreenLink({ title, screenName }: ScreenLinkProps) {
  const navigation = useNavigation<AppRouteProps>();

  return (
    <TouchableOpacity onPress={() => navigation.navigate(screenName)}>
      <View style={styles.cell}>
        <Text style={styles.cellTitle}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

export function OptionsMenuScreen() {
  return (
    <View style={styles.container}>
      <ViewWelcomeScreenButton />
      <ApiEndpointButton />
      <JwtButton />
      <MacAddressButton />
      {isDevEnv ? (
        <>
          <DemandResponseToggle />
          <ScreenLink title="Debug" screenName="Debug" />
        </>
      ) : (
        <></>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  cell: {
    backgroundColor: theme.background,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.backdrop,
  },
  alignRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cellTitle: {
    ...typography.headline2,
    paddingRight: theme.padding,
  },
});
