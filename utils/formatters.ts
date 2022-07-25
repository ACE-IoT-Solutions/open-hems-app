import { DeviceStatus, WattHours, DemandResponseStatus, ChargeRate } from "../types";

const statusLabels: Record<DeviceStatus, string> = {
  active: "Active",
  inactive: "Inactive",
};

export function formatDeviceStatus(status: DeviceStatus): string {
  return statusLabels[status];
}

export function formatBatteryStatus(status: DeviceStatus, chargeRate: ChargeRate): string {
  if (status === "inactive") {
    return "No Service";
  }
  if (chargeRate === "idle") {
    return "Idle";
  }

  return "Charging";
}

const serviceLabels: Record<DemandResponseStatus, string> = {
  normal: "Unlimited",
  curtailed: "Curtailed",
  heightened: "Heightened",
  opted_out: "Unlimited",
};

export function formatDeviceService(service: DemandResponseStatus): string {
  return serviceLabels[service];
}

export function formatEnergy(energy: WattHours): string {
  const energyStr = (energy / 1000.0).toFixed(2).replace(".00", "");

  return `${energyStr} kWh`;
}

export function formatPercentage(dividend: number, divisor = 100) {
  return `${Math.floor((100 * dividend) / divisor)}%`;
}
