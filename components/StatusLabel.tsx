import React from "react";
import { Text } from "react-native";
import { typography } from "../theme";
import { DeviceStatus } from "../types";
import { formatDeviceStatus } from "../utils/formatters";

type StatusLabelProps = {
  status: DeviceStatus;
};

export const StatusLabel = ({ status }: StatusLabelProps) => {
  const formattedStatus = formatDeviceStatus(status);
  return (
    <Text testID="StatusLabel" style={typography.label}>
      {formattedStatus}
    </Text>
  );
};
