import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { DemandResponseNotification } from "./DemandResponseNotification";

describe("DemandResponseNotification", () => {
  it("calls passed onPress function when clicked", () => {
    const mockOnPress = jest.fn();
    const testID = "DemandResponseNotification";
    const { getByTestId } = render(<DemandResponseNotification onPress={mockOnPress} />);

    fireEvent.press(getByTestId(testID));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});
