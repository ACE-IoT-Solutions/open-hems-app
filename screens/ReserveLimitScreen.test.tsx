import React from "react";
import { act, fireEvent, render } from "@testing-library/react-native";
import { ReserveLimitScreen } from "./ReserveLimitScreen";

const mockGoBack = jest.fn();
jest.mock("@react-navigation/native", () => {
  return {
    useRoute: jest.fn().mockReturnValue({ params: { deviceId: "HomeBatteryDeviceId", reserveLimit: 80 } }),
    useNavigation: () => ({
      goBack: mockGoBack,
    }),
  };
});

describe("ReserveLimitScreen", () => {
  it("renders form", async () => {
    const { findAllByA11yRole, getByA11yLabel, getByA11yState } = render(<ReserveLimitScreen />);

    // 6 numeric buttons, submit button, and two Opt-Out buttons
    expect((await findAllByA11yRole("button")).length).toEqual(9);
    expect(getByA11yLabel("80")).toEqual(getByA11yState({ selected: true }));
    expect(getByA11yLabel("Submit")).toBeTruthy();
  });

  it("will hit API upon submit", async () => {
    const mockFetch = jest.fn().mockResolvedValue({ status: 200 });
    global.fetch = mockFetch;

    const { findByA11yLabel, getByA11yLabel, getByA11yState } = render(<ReserveLimitScreen />);

    const newReserveLimitButton = await findByA11yLabel("60");
    fireEvent.press(newReserveLimitButton);
    expect(newReserveLimitButton).toEqual(getByA11yState({ selected: true }));

    await act(() => {
      fireEvent.press(getByA11yLabel("Submit"));
      return Promise.resolve();
    });

    expect(mockFetch).toHaveBeenCalled();
    expect(mockGoBack).toHaveBeenCalled();
  });
});
