import { getLocalTemperature } from "./getLocalTemperature";

describe("getLocalTemperature", () => {
  it("returns a number given an number ", () => {
    const tempResult = getLocalTemperature(25);
    expect(typeof tempResult).toBe("number");
  });
  it("returns a correct number given a string", () => {
    const tempResult = getLocalTemperature("25");
    expect(tempResult).toBe(77);
  });

  it("returns null when there is missing data", () => {
    const tempResult = getLocalTemperature(undefined);
    expect(tempResult).toBe(null);
  });
});
