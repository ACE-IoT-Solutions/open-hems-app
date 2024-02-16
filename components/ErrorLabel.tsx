import React from "react";
import { Text } from "react-native";
import { typography } from "../theme";

type ErrorLabelProps = {
  message: string;
  style?: object;
  testID?: string;
};

export const ErrorLabel = ({
  message = "We're sorry, something went wrong.",
  style,
  testID = "ErrorLabel",
}: ErrorLabelProps) => {
  return (
    <Text testID={testID} style={{ ...style, ...typography.errorText }} maxFontSizeMultiplier={2}>
      {message}
    </Text>
  );
};
