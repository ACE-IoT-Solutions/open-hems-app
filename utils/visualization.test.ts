import { Watts, PowerDataSamples, PowerData } from "../types";
import { preparePowerData, sanitize } from "./visualization";

const buildSample = (timestamp: string, power_generated: Watts): PowerData => ({
  timestamp: new Date(timestamp),
  power: power_generated,
});

describe("preparePowerData", () => {
  it("will filter data by date", () => {
    const samples: PowerDataSamples = [
      buildSample("2020-01-01T00:12:00", 16),
      buildSample("2022-01-01T08:12:00", 51),
      buildSample("2022-01-02T00:00:00", 3),
    ];

    expect(preparePowerData(samples, new Date("2022-01-01T00:00:00"))).toEqual([{ x: 8, y: 51 }]);
  });

  it("will map data by hour", () => {
    const samples: PowerDataSamples = [
      buildSample("2020-01-01T00:12:00", 16),
      buildSample("2022-01-01T08:12:00", 51),
      buildSample("2022-01-02T00:00:00", 3),
    ];

    expect(preparePowerData(samples, new Date("2022-01-01T00:00:00"))).toEqual([{ x: 8, y: 51 }]);
  });
});

describe("sanitize", () => {
  it("will pad an empty array with a null element", () => {
    expect(sanitize([])).toEqual([{ x: 0, y: 0 }]);
  });
  it("will noop for non-empty arrays", () => {
    expect(sanitize([{ x: 1, y: 1 }])).toEqual([{ x: 1, y: 1 }]);
  });
});
