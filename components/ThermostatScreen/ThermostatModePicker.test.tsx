import React from "react";
import { RenderAPI } from "@testing-library/react-native";
import { render, fireEvent, within } from "@testing-library/react-native";

import { ThermostatModePicker } from "./ThermostatModePicker";
import { ThermostatModePickerData } from "./ThermostatModePickerItem";
import { capitalize } from "lodash";

import CoolModeIcon from "../assets/svg/thermostat-modes/cool-mode.svg";
import AutoModeIcon from "../assets/svg/thermostat-modes/auto-mode.svg";
import HeatModeIcon from "../assets/svg/thermostat-modes/heat-mode.svg";
import EcoModeIcon from "../assets/svg/thermostat-modes/eco-mode.svg";

describe("ThermostatModePicker", () => {
  const modes: ThermostatModePickerData[] = [
    { mode: "auto", icon: <AutoModeIcon /> },
    { mode: "heat", icon: <HeatModeIcon /> },
    { mode: "cool", icon: <CoolModeIcon /> },
    { mode: "eco", icon: <EcoModeIcon /> },
    { mode: "off" },
  ];

  const selectedMode = modes[1].mode;
  let subject: RenderAPI;
  let mockSetSelectedMode: jest.Mock;

  beforeEach(() => {
    mockSetSelectedMode = jest.fn();

    subject = render(
      <ThermostatModePicker options={modes} selectedMode={selectedMode} onChange={mockSetSelectedMode} />
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("displays the selected mode as its label", () => {
    const testID = "ThermostatModePicker";
    const { getByTestId } = subject;
    const pickerEl = within(getByTestId(testID));

    expect(pickerEl.getByText(capitalize(selectedMode))).toBeTruthy();
  });

  it("renders a menu item for each mode", () => {
    const menuTestID = "ThermostatModePicker";
    const optionTestID = "ThermostatModePickerItem";
    const { getByTestId, getAllByTestId } = subject;

    fireEvent.press(getByTestId(menuTestID));
    expect(getAllByTestId(optionTestID)).toHaveLength(modes.length);
  });
});
