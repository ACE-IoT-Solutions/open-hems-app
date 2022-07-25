import React from "react";
import { render, RenderAPI } from "@testing-library/react-native";
import { ChargeRateSlider } from "./ChargeRateSlider";
import { ChargeRate } from "../types";

describe("ChargeRateSlider", () => {
  let subject: RenderAPI;

  const mockSlidingComplete = jest.fn();
  const rates: ChargeRate[] = ["idle", "low", "medium", "high"];

  beforeEach(() => {
    subject = render(<ChargeRateSlider rates={rates} onSlidingComplete={mockSlidingComplete} />);
  });

  it("renders a label for each given rate", async () => {
    const { findAllByTestId } = subject;
    const testID = "ChargeRateSlider-rate-label";
    expect(await findAllByTestId(testID)).toHaveLength(rates.length);
  });

  it("renders a `Slider` component", async () => {
    const { getByTestId } = subject;
    const testID = "ChargeRateSlider-slider";
    const container = getByTestId(testID);
    expect(container).toBeTruthy();
    expect(container.children).toBeTruthy();
  });
});
