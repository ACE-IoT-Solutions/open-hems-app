import React from "react";
import { Text } from "react-native";
import { typography } from "../theme";
import { DemandResponseStatus } from "../types";
import { formatDeviceService } from "../utils/formatters";

type ServiceLabelProps = {
  dr_status: DemandResponseStatus;
};

export const ServiceLabel = ({ dr_status }: ServiceLabelProps) => {
  const formattedService = formatDeviceService(dr_status);

  return (
    <Text testID="ServiceLabel" style={typography.label}>
      Service: {formattedService}
    </Text>
  );
};
