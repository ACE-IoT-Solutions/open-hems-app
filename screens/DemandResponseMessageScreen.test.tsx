import React from "react";
import { act, fireEvent, render } from "@testing-library/react-native";
import { DemandResponseMessageScreen } from "./DemandResponseMessageScreen";
import { homeConfigData } from "../test/factories";

const mockGoBack = jest.fn();
const mockRouteParams = {
  deviceId: "some-device-id",
  showOptOutButton: false,
};

jest.mock("@react-navigation/native", () => ({
  useRoute: jest.fn(() => {
    return { params: mockRouteParams };
  }),
  useNavigation: () => ({
    goBack: mockGoBack,
  }),
}));

describe("DemandResponseMessageScreen", () => {
  const mockFetch = jest.fn();
  global.fetch = mockFetch;

  const demandResponseData = {
    home: homeConfigData({
      lpc_config: {
        current_event_message: {
          title: "demand respond title",
          message: "a custom dr message",
        },
      },
    }),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("when navigated without opt out params", () => {
    beforeEach(() => {
      mockRouteParams.showOptOutButton = false;
      mockFetch.mockResolvedValueOnce({ status: 200, json: () => demandResponseData });
    });

    it("renders message and does not show opt out button", async () => {
      const { findByText, queryByA11yLabel } = render(<DemandResponseMessageScreen />);

      expect(await findByText("a custom dr message")).toBeTruthy();
      expect(queryByA11yLabel("Opt Out of Power Event")).toBeFalsy();
    });
  });

  describe("when navigated with opt out params", () => {
    beforeEach(() => {
      mockRouteParams.showOptOutButton = true;
      mockFetch.mockResolvedValueOnce({ status: 200, json: () => demandResponseData });
    });

    it("does render opt out button", async () => {
      const { findByA11yLabel } = render(<DemandResponseMessageScreen />);
      expect(await findByA11yLabel("Opt Out of Power Event")).toBeTruthy();
    });

    it("hits API endpoint when opt out button is pressed", async () => {
      mockFetch.mockResolvedValueOnce({ status: 200, json: () => ({}) });

      const { findByA11yLabel } = render(<DemandResponseMessageScreen />);
      const optOutButton = await findByA11yLabel("Opt Out of Power Event");
      expect(optOutButton).toBeTruthy();

      await act(() => {
        fireEvent.press(optOutButton);
        return Promise.resolve();
      });

      expect(mockFetch).toHaveBeenCalled();
      expect(mockGoBack).toHaveBeenCalled();
    });
  });
});
