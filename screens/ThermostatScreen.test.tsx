import React from "react";
import { act, fireEvent, render } from "@testing-library/react-native";
import { ThermostatScreen } from "./ThermostatScreen";
import { homeConfigData, thermostatData } from "../test/factories";

let mockUseFocusCallback: React.EffectCallback;
const mockNavigate = jest.fn();

jest.mock("lodash", () => ({
  ...jest.requireActual("lodash"),
  debounce: jest.fn((fn) => fn),
}));

jest.mock("@react-navigation/native", () => {
  return {
    useFocusEffect: jest.fn().mockImplementation((callback: React.EffectCallback) => {
      if (callback !== mockUseFocusCallback) {
        mockUseFocusCallback = callback;
      }
    }),
    useRoute: jest.fn().mockReturnValue({ params: { deviceId: "Theromstat-device-id" } }),
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

describe("ThermostatScreen", () => {
  const mockFetch = jest.fn();
  global.fetch = mockFetch;

  const renderSubject = () => {
    const renderApi = render(<ThermostatScreen />);
    act(() => {
      mockUseFocusCallback();
    });
    return renderApi;
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("when API data is available", () => {
    beforeEach(() => {
      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: () => ({ home: homeConfigData() }),
      });
      mockFetch.mockResolvedValueOnce({ status: 200, json: () => thermostatData({ id: "Thermostat-device-id" }) });
    });

    it("renders thermostat data", async () => {
      const { findByTestId, getAllByA11yRole } = renderSubject();
      expect(await findByTestId("ThermostatScreen-device-data")).toBeTruthy();
      // 2 thermostat buttons, 2 modal navigation buttons.
      expect(await getAllByA11yRole("button")).toHaveLength(4);
    });

    it("renders a mode picker", async () => {
      const testID = "ThermostatModePicker";
      const { findByTestId } = renderSubject();
      expect(await findByTestId(testID)).toBeTruthy();
    });

    it("renders outdoor temperature", async () => {
      const testID = "ThermostatScreen-outdoor-temp";
      const { findByTestId, getByTestId } = renderSubject();
      expect(await findByTestId(testID)).toBeTruthy();
      expect(getByTestId("exteriorWeatherSvg")).toBeTruthy();
    });

    it("shows loading and error states on update setpoint", async () => {
      mockFetch.mockResolvedValueOnce({ status: 500 });
      const { findByA11yLabel, findByTestId } = renderSubject();
      fireEvent.press(await findByA11yLabel("Warm"));
      expect(await findByTestId("ThermostatUpdateActivityIndicator")).toBeTruthy();
      expect(await findByTestId("ThermostatUpdateError")).toBeTruthy();
    });
  });

  describe("when API data is available and response is curtailed", () => {
    beforeEach(() => {
      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: () => ({
          home: homeConfigData({
            lpc_config: {
              current_event_message: {
                title: "demand response title",
              },
            },
          }),
        }),
      });
      mockFetch.mockResolvedValueOnce({ status: 200, json: () => thermostatData({ dr_status: "curtailed" }) });
    });

    describe("when the temperature controls are pressed", () => {
      it("draws an opt out modal and defers api call", async () => {
        const screen = renderSubject();
        const warmButton = await screen.findByA11yLabel("Warm");
        fireEvent.press(warmButton);

        expect(await screen.findByTestId("OptOutModal")).toBeTruthy();
      });
    });

    it("draws a notification and navigates to DemandRespondScreen when pressed", async () => {
      const screen = renderSubject();
      const demandResponseNotification = await screen.findByTestId("DemandResponseNotification");
      fireEvent.press(demandResponseNotification);
      expect(mockNavigate).toHaveBeenCalledWith("DemandResponseMessage", { title: "demand response title" });
    });
  });

  describe("when device data is loading", () => {
    it("draws loading indicator", async () => {
      const { findByTestId } = renderSubject();
      expect(await findByTestId("LoadingIndicator")).toBeTruthy();
    });
  });

  describe("when device API call fails", () => {
    it("draws error message", async () => {
      mockFetch.mockResolvedValueOnce({
        status: 500,
        json: () => ({}),
      });

      const { findByTestId } = renderSubject();
      expect(await findByTestId("ErrorMessage")).toBeTruthy();
    });
  });

  describe("when user has opted out of demand response for device", () => {
    beforeEach(() => {
      const thermostatData = {
        status: 200,
        json: () => ({
          dr_status: "opted_out",
        }),
      };
      mockFetch.mockResolvedValueOnce(thermostatData);
    });
    it("presents opted out notification", async () => {
      const { findByTestId } = renderSubject();
      await expect(findByTestId("OptedOutNotification")).toBeTruthy();
    });
  });
});
