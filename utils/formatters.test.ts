import {
  formatBatteryStatus,
  formatDeviceService,
  formatDeviceStatus,
  formatEnergy,
  formatPercentage,
} from "./formatters";

describe("formatDeviceStatus", () => {
  it('returns "Active" for active status', () => {
    expect(formatDeviceStatus("active")).toBe("Active");
  });

  it('returns "Inactive" for active status', () => {
    expect(formatDeviceStatus("inactive")).toBe("Inactive");
  });
});

describe("formatBatteryStatus", () => {
  it("returns correct labels", () => {
    expect(formatBatteryStatus("active", "high")).toBe("Charging");
    expect(formatBatteryStatus("active", "medium")).toBe("Charging");
    expect(formatBatteryStatus("active", "low")).toBe("Charging");
    expect(formatBatteryStatus("active", "idle")).toBe("Idle");
    expect(formatBatteryStatus("inactive", "high")).toBe("No Service");
  });
});

describe("formatDeviceService", () => {
  it('returns "Unlimited" for normal service', () => {
    expect(formatDeviceService("normal")).toBe("Unlimited");
  });
});

describe("formatEnergy", () => {
  it("scales Wh to kWh and labels energy accordingly", () => {
    expect(formatEnergy(1000)).toBe("1 kWh");
  });

  it("will use maximum precision of 2 decimals", () => {
    expect(formatEnergy(10337)).toBe("10.34 kWh");
  });
});

describe("formatPercentage", () => {
  it("formats a percentage", () => {
    expect(formatPercentage(120, 1000)).toBe("12%");
  });

  it("does not present decimals", () => {
    expect(formatPercentage(242, 2000)).toBe("12%");
  });

  it("will default divisor of 100", () => {
    expect(formatPercentage(78)).toBe("78%");
  });
});
