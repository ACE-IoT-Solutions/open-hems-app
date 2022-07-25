import React from "react";
import { View } from "react-native";
import { DemandResponseNotification } from "./DemandResponseNotification";
import { OptedOutNotification } from "./OptedOutNotification";

type DemandResponseStatus = {
  drStatus: string;
  onPress: () => void;
};

export function ConditionalDemandResponse({ drStatus, onPress }: DemandResponseStatus) {
  return (
    <View>
      {drStatus === "opted_out" ? <OptedOutNotification /> : <DemandResponseNotification onPress={onPress} />}
    </View>
  );
}
