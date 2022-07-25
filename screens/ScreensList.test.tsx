import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import { ScreensList } from "./ScreensList";

jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native");
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
  };
});

describe("ScreensList", () => {
  it("renders", async () => {
    await waitFor(() => render(<ScreensList />));
  });
});
