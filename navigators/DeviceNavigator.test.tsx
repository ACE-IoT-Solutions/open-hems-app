import React from "react";
import { render } from "@testing-library/react-native";
import { DeviceNavigator } from "./DeviceNavigator";
import { homeConfigData, thermostatData } from "../test/factories";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";

const MockSafeAreaProvider = ({ children }: { children: React.ReactNode }) => {
  const initialMetrics = {
    frame: { x: 0, y: 0, width: 0, height: 0 },
    insets: { top: 0, left: 0, right: 0, bottom: 0 },
  };

  return <SafeAreaProvider initialMetrics={initialMetrics}>{children}</SafeAreaProvider>;
};

describe("DeviceNavigator", () => {
  const mockFetch = jest.fn();
  global.fetch = mockFetch;

  const renderSubject = () => {
    return render(
      <NavigationContainer>
        <MockSafeAreaProvider>
          <DeviceNavigator />
        </MockSafeAreaProvider>
      </NavigationContainer>
    );
  };

  afterEach(() => {
    mockFetch.mockClear();
  });

  describe("when loading", () => {
    it("draws loading indicator", async () => {
      const { findByTestId } = renderSubject();
      expect(await findByTestId("LoadingIndicator")).toBeTruthy();
    });
  });

  describe("with data", () => {
    it("renders and presents DeviceNavigator screen", async () => {
      mockFetch.mockResolvedValueOnce({ status: 200, json: () => ({ devices: [thermostatData()] }) });
      mockFetch.mockResolvedValueOnce({ status: 200, json: () => thermostatData() });
      mockFetch.mockResolvedValueOnce({ status: 200, json: () => homeConfigData() });

      const { getByTestId, findByTestId } = renderSubject();
      expect(await findByTestId("DeviceNavigator")).toBeTruthy();
      expect(mockFetch).toHaveBeenCalledTimes(3);
      expect(getByTestId("DeviceHeader")).toBeTruthy();
    });
  });

  describe("when API returns error", () => {
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
