import React from "react";
import { RenderAPI, fireEvent } from "@testing-library/react-native";
import { render } from "@testing-library/react-native";

import { ThermostatModePickerItem } from "./ThermostatModePickerItem";
import GenericModeIcon from "../../assets/svg/thermostat-modes/generic-mode.svg";

describe("ThermostatModePickerItem", () => {
  let subject: RenderAPI;

  const mockOnPress = jest.fn();
  const mockIcon = <GenericModeIcon />;

  beforeEach(() => {
    subject = render(<ThermostatModePickerItem label={"Test"} icon={mockIcon} onPress={mockOnPress} />);
    jest.clearAllMocks();
  });

  it("renders an icon and label when both are given", () => {
    const labelId = "ThermostatModePickerItem-label";
    const iconContainerId = "ThermostatModePickerItem-icon-container";
    const { getByTestId } = subject;

    expect(getByTestId(labelId)).toBeTruthy();
    expect(getByTestId(iconContainerId)).toBeTruthy();
    expect(getByTestId(iconContainerId).children).toHaveLength(1);
  });

  it("renders an icon-sized spacer when no icon is given", () => {
    subject = render(<ThermostatModePickerItem label={"Test"} onPress={mockOnPress} />);

    const spacerId = "ThermostatModePickerItem-spacer";
    const { getByTestId } = subject;

    expect(getByTestId(spacerId)).toBeTruthy();
  });

  it("invokes the given onPress method when pressed", () => {
    const containerId = "ThermostatModePickerItem";
    const { getByTestId } = subject;

    fireEvent.press(getByTestId(containerId));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});
