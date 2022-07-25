import React from "react";
import { act } from "react-test-renderer";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { HomeBatteryScreen } from "./HomeBatteryScreen";
import * as formatters from "../utils/formatters";
import { useNavigation } from "@react-navigation/native";
import { homeBatteryData, homeConfigData } from "../test/factories";

let mockUseFocusCallback: React.EffectCallback;

jest.mock("@react-navigation/native", () => ({
  useFocusEffect: jest.fn().mockImplementation((callback: React.EffectCallback) => {
    if (callback !== mockUseFocusCallback) {
      mockUseFocusCallback = callback;
    }
  }),
  useRoute: jest.fn().mockReturnValue({ params: { deviceId: "HomeBatteryDeviceId" } }),
  useNavigation: jest.fn().mockReturnValue({
    navigate: jest.fn(),
  }),
}));

describe("HomeBatteryScreen", () => {
  const mockFetch = jest.fn();
  global.fetch = mockFetch;

  const renderSubject = () => {
    const renderApi = render(<HomeBatteryScreen />);
    act(() => {
      mockUseFocusCallback();
    });
    return renderApi;
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("with device data", () => {
    beforeEach(() => {
      mockFetch.mockResolvedValueOnce({ status: 200, json: () => homeBatteryData({ dr_status: "normal" }) });
      mockFetch.mockResolvedValueOnce({ status: 200, json: () => ({ home: homeConfigData() }) });
    });

    it("draws according to designs", async () => {
      const statusFormatterSpy = jest.spyOn(formatters, "formatDeviceService");
      const { findByTestId, getByTestId } = renderSubject();

      // Service label
      await waitFor(async () => expect(await findByTestId("ServiceLabel")).toBeTruthy(), {
        timeout: 2000,
      });
      expect(statusFormatterSpy).toHaveBeenCalledWith("normal");

      // Charge presentation widget
      expect(getByTestId("HorizontalProgressMeter")).toBeTruthy();

      // Charge rate slider
      expect(getByTestId("ChargeRateSlider-slider")).toBeTruthy();

      // Set reserve limit button
      expect(getByTestId("SetReserveLimitButton")).toBeTruthy();
    });

    it("tapping on reserve limit button navigates to new page", async () => {
      const { navigate } = useNavigation();
      const { getByTestId, findByTestId } = renderSubject();

      await waitFor(async () => expect(await findByTestId("SetReserveLimitButton")).toBeTruthy(), {
        timeout: 2000,
      });

      const button = await getByTestId("SetReserveLimitButton");
      fireEvent.press(button);
      expect(navigate).toHaveBeenCalledWith("ReserveLimit", {
        deviceId: "HomeBatteryDeviceId",
        reserveLimit: 20,
        showOptOutModal: false,
      });
    });

    it("presents status label", async () => {
      const formatterSpy = jest.spyOn(formatters, "formatBatteryStatus");
      const { findByTestId } = renderSubject();

      expect(await findByTestId("BatteryStatus")).toBeTruthy();
      expect(formatterSpy).toHaveBeenCalledWith("active", "high");
    });
  });

  describe("with device data, when a demand response is active", () => {
    beforeEach(() => {
      mockFetch.mockResolvedValueOnce({ status: 200, json: () => homeBatteryData({ dr_status: "curtailed" }) });
      mockFetch.mockResolvedValueOnce({ status: 200, json: () => ({ home: homeConfigData() }) });
    });

    it("draws notification", async () => {
      const { findByTestId } = renderSubject();
      await expect(findByTestId("OptedOutNotification")).toBeTruthy();
    });

    it("tapping on reserve limit button navigates to new page", async () => {
      const { navigate } = useNavigation();
      const { getByTestId, findByTestId } = renderSubject();

      await waitFor(async () => expect(await findByTestId("SetReserveLimitButton")).toBeTruthy(), {
        timeout: 2000,
      });

      const button = await getByTestId("SetReserveLimitButton");
      fireEvent.press(button);
      expect(navigate).toHaveBeenCalledWith("ReserveLimit", {
        deviceId: "HomeBatteryDeviceId",
        reserveLimit: 20,
        showOptOutModal: true,
      });
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

      mockFetch.mockResolvedValueOnce({
        status: 500,
        json: () => ({}),
      });

      const { findByTestId } = renderSubject();
      expect(await findByTestId("ErrorMessage")).toBeTruthy();
    });
  });
});
