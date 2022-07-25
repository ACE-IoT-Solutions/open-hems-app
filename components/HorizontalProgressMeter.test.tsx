import React from "react";
import { render } from "@testing-library/react-native";
import { HorizontalProgressMeter } from "./HorizontalProgressMeter";

describe("HorizontalProgressMeter", () => {
  it("renders", () => {
    render(<HorizontalProgressMeter chargePercentage={80} reserveLimit={60} />);
  });
});
