export type Percentage = number;
export type Watts = number;
export type WattHours = number;

export type DeviceId = string;
export type DeviceType = 
// "welcome" | 
                          "thermostat" | "ev_charger" | "water_heater" | "pv_system" | "home_battery";
export type DeviceService = "unlimited" | "normal" | "heat_pump" | "high_demand" | "energy_saver" | "vacation";
export type DeviceStatus = "active" | "inactive";
export type DemandResponseStatus = "normal" | "curtailed" | "heightened" | "opted_out";

type BaseDeviceData = {
  id: DeviceId;
  type: string;
  name: string;
  location: string;
  status: DeviceStatus;
  provisioned: boolean;
  dr_status: DemandResponseStatus;
};

export type WaterHeaterData = BaseDeviceData & {
  service: DeviceService;
  usage_samples: PowerUsedSamples;
};

export type ThermostatMode = "auto" | "heat" | "cool" | "eco" | "off";
export type Weather = "clear" | "cloudy" | "partly_cloudy" | "rainy" | "windy";
export type ThermostatData = BaseDeviceData & {
  mode: ThermostatMode;
  interior_temperature: number;
  exterior_temperature: number;
  setpoint: number;
  setpoint_span: number;
  exterior_weather: Weather;
};

type PowerGenerationSample = {
  power_generated: Watts;
  timestamp: string;
};
type PowerUsedSample = {
  power_used: Watts;
  timestamp: string;
};

export type PowerData = { timestamp: Date; power: Watts };
export type PowerDataSamples = Array<PowerData>;

export type PowerGenerationSamples = Array<PowerGenerationSample>;
type PowerUsedSamples = Array<PowerUsedSample>;

export type SolarPanelData = BaseDeviceData & {
  power_generated_this_month: WattHours;
  power_sent_to_grid_this_month: WattHours;
  generation_samples: PowerGenerationSamples;
};

export type HomeBatteryData = BaseDeviceData & {
  charge_percentage: number;
  service: DeviceService;
  charge_rate: ChargeRate;
  reserve_limit: number;
};

export type ChargeRate = "idle" | "low" | "medium" | "high";

export type CarChargerData = BaseDeviceData & {
  charge_percentage: number;
  charge_rate: ChargeRate;
  service: DeviceService;
};

type DeviceData = CarChargerData | ThermostatData | WaterHeaterData | SolarPanelData | HomeBatteryData;

export type DeviceList = Array<DeviceData>;
export type DeviceListResponse = {
  devices: DeviceList;
};
type EventMessage = { title: string; message: string };
type LpcConfig = {
  name: string;
  status_communication: boolean;
  technical_contact: string;
  technical_email: string;
  technical_phone: string;
  current_event_message: EventMessage;
  default_event_message: EventMessage;
};

export type HomeConfigData = {
  id: string;
  lpc_config: LpcConfig;
};
export type HemsData = {
  id: string;
  dr_status: DemandResponseStatus;
};
