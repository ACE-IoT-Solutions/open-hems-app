import React from "react";
import { act } from "react-test-renderer";
import { render } from "@testing-library/react-native";
import { SolarPanelScreen } from "./SolarPanelScreen";
import * as formatters from "../utils/formatters";

const mockNavigate = jest.fn();
let mockUseFocusCallback: React.EffectCallback;

jest.mock("@react-navigation/native", () => {
  return {
    useFocusEffect: jest.fn().mockImplementation((callback: React.EffectCallback) => {
      if (callback !== mockUseFocusCallback) {
        mockUseFocusCallback = callback;
      }
    }),
    useRoute: jest.fn().mockReturnValue({ params: { deviceId: "SolarPanel" } }),
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

describe("SolarPanelScreen", () => {
  const mockFetch = jest.fn();
  global.fetch = mockFetch;

  const renderSubject = () => {
    const renderApi = render(<SolarPanelScreen />);
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
      mockFetch.mockResolvedValue({
        status: 200,
        json: () => ({
          status: "active",
          power_generated_this_month: "2000000.00",
          power_sent_to_grid_this_month: "20000.00",
          generation_samples: [],
        }),
      });
    });

    it("presents Status label", async () => {
      const statusFormatterSpy = jest.spyOn(formatters, "formatDeviceStatus");
      const { findByTestId } = renderSubject();
      expect(await findByTestId("StatusLabel")).toBeTruthy();
      expect(statusFormatterSpy).toHaveBeenCalledWith("active");
    });

    it("draw energy generated graph", async () => {
      const { findByTestId } = renderSubject();
      expect(await findByTestId("EnergyGraph")).toBeTruthy();
    });

    it("displays correct percentage calculation", async () => {
      const formatterSpy = jest.spyOn(formatters, "formatEnergy");
      const percentageFormatterSpy = jest.spyOn(formatters, "formatPercentage");
      const { findByTestId } = renderSubject();
      expect(await findByTestId("EnergyGenerated")).toBeTruthy();
      expect(formatterSpy).toHaveBeenCalledWith("2000000.00");
      expect(formatterSpy).toHaveBeenCalledWith("20000.00");
      expect(percentageFormatterSpy).toHaveBeenCalledWith("20000.00", "2000000.00");
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
});
