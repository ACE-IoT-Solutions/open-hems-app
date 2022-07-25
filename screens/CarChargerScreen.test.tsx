import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import * as formatters from "../utils/formatters";

import { CarChargerScreen } from "./CarChargerScreen";
import { carChargerData, homeConfigData } from "../test/factories";
import { act } from "react-test-renderer";

let mockUseFocusCallback: React.EffectCallback;
const mockNavigate = jest.fn();

jest.mock("@react-navigation/native", () => {
  return {
    useFocusEffect: jest.fn().mockImplementation((callback: React.EffectCallback) => {
      if (callback !== mockUseFocusCallback) {
        mockUseFocusCallback = callback;
      }
    }),
    useRoute: jest.fn().mockReturnValue({ params: { deviceId: "CarCharger" } }),
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

describe("CarChargerScreen", () => {
  const mockFetch = jest.fn();
  global.fetch = mockFetch;

  const renderSubject = () => {
    const renderApi = render(<CarChargerScreen />);
    act(() => {
      mockUseFocusCallback();
    });
    return renderApi;
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("with device data", () => {
    it("presents Service label", async () => {
      mockFetch.mockResolvedValueOnce({ status: 200, json: () => ({ home: homeConfigData() }) });
      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: () => carChargerData(),
      });

      const statusFormatterSpy = jest.spyOn(formatters, "formatDeviceService");
      const { findByTestId } = renderSubject();

      expect(await findByTestId("ServiceLabel")).toBeTruthy();
      expect(statusFormatterSpy).toHaveBeenCalledWith("curtailed");
    });

    it("presents battery status label", async () => {
      mockFetch.mockResolvedValueOnce({ status: 200, json: () => ({ home: homeConfigData() }) });
      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: () => carChargerData(),
      });

      const formatterSpy = jest.spyOn(formatters, "formatBatteryStatus");
      const { findByTestId } = renderSubject();
      expect(await findByTestId("BatteryStatus")).toBeTruthy();
      expect(formatterSpy).toHaveBeenCalledWith("active", "medium");
    });

    it("navigates to DemandRespondScreen when notification is pressed", async () => {
      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: () => ({
          home: homeConfigData({
            lpc_config: {
              current_event_message: {
                title: "DR event in progress",
              },
            },
          }),
        }),
      });
      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: () => carChargerData({ dr_status: "curtailed", name: "Ev Charger" }),
      });

      const screen = renderSubject();
      const demandResponseNotification = await screen.findByTestId("DemandResponseNotification");
      fireEvent.press(demandResponseNotification);
      expect(mockNavigate).toHaveBeenCalledWith("DemandResponseMessage", {
        title: "DR event in progress",
      });
    });
  });

  describe("when user has opted out of demand response for device", () => {
    beforeEach(() => {
      const carChargerResponse = {
        status: 200,
        json: () => carChargerData({ dr_status: "opted_out" }),
      };
      mockFetch.mockResolvedValueOnce(carChargerResponse);
    });

    it("presents opted out notification", async () => {
      const { findByTestId } = renderSubject();
      await expect(findByTestId("OptedOutNotification")).toBeTruthy();
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

      mockFetch.mockResolvedValueOnce({ status: 200, json: () => ({ home: homeConfigData() }) });

      const { findByTestId } = renderSubject();
      expect(await findByTestId("ErrorMessage")).toBeTruthy();
    });
  });
});
