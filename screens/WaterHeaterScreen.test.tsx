import React from "react";
import { act } from "react-test-renderer";
import { fireEvent, render } from "@testing-library/react-native";
import { WaterHeaterScreen } from "./WaterHeaterScreen";
import * as formatters from "../utils/formatters";
import { homeConfigData } from "../test/factories";

const mockNavigate = jest.fn();
let mockUseFocusCallback: React.EffectCallback;

jest.mock("@react-navigation/native", () => ({
  useFocusEffect: jest.fn().mockImplementation((callback: React.EffectCallback) => {
    if (callback !== mockUseFocusCallback) {
      mockUseFocusCallback = callback;
    }
  }),
  useRoute: jest.fn().mockReturnValue({ params: { deviceId: "WaterHeaterDeviceId" } }),
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe("WaterHeaterScreen", () => {
  const mockFetch = jest.fn();
  global.fetch = mockFetch;

  const renderSubject = () => {
    const renderApi = render(<WaterHeaterScreen />);
    act(() => {
      mockUseFocusCallback();
    });
    return renderApi;
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("when data is available", () => {
    beforeEach(() => {
      const waterHeaterResponse = {
        status: 200,
        json: () => ({
          status: "active",
          service: "unlimited",
          name: "Water Heater",
          dr_status: "curtailed",
        }),
      };

      const homeConfigDataResponse = {
        status: 200,
        json: () => ({
          home: homeConfigData({
            lpc_config: {
              current_event_message: {
                title: "demand respond title",
              },
            },
          }),
        }),
      };
      mockFetch.mockResolvedValueOnce(homeConfigDataResponse);
      mockFetch.mockResolvedValueOnce(waterHeaterResponse);
    });

    it("presents StatusLabel", async () => {
      const statusFormatterSpy = jest.spyOn(formatters, "formatDeviceStatus");
      const screen = renderSubject();
      expect(await screen.findByTestId("StatusLabel")).toBeTruthy();
      expect(mockFetch).toHaveBeenCalled();
      expect(statusFormatterSpy).toHaveBeenCalledWith("active");
    });

    it("presents Service label", async () => {
      const statusFormatterSpy = jest.spyOn(formatters, "formatDeviceService");
      const { findByTestId } = renderSubject();
      expect(await findByTestId("ServiceLabel")).toBeTruthy();
      expect(statusFormatterSpy).toHaveBeenCalledWith("curtailed");
    });

    it("navegates to DemandRespondScreen when notification is pressed", async () => {
      const screen = renderSubject();
      const demandResponseNotification = await screen.findByTestId("DemandResponseNotification");
      fireEvent.press(demandResponseNotification);
      expect(mockNavigate).toHaveBeenCalledWith("DemandResponseMessage", {
        title: "demand respond title",
        deviceId: "WaterHeaterDeviceId",
        showOptOutButton: true,
      });
    });

    it("presents Power Usage Graph", async () => {
      const { findByTestId } = renderSubject();
      expect(await findByTestId("PowerUsageGraph")).toBeTruthy();
    });

    describe("when user has opted out of demand response for device", () => {
      beforeEach(() => {
        const waterHeaterResponse = {
          status: 200,
          json: () => ({
            dr_status: "opted_out",
          }),
        };
        mockFetch.mockResolvedValueOnce(waterHeaterResponse);
      });
      it("presents opted out notification", async () => {
        const { findByTestId } = renderSubject();
        await expect(findByTestId("OptedOutNotification")).toBeTruthy();
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

      const { findByTestId } = renderSubject();
      expect(await findByTestId("ErrorMessage")).toBeTruthy();
    });
  });
});
