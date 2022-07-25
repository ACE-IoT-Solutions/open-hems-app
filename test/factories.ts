import { CarChargerData, HomeBatteryData, HomeConfigData, ThermostatData } from "../types";
import { merge } from "lodash";

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

const defaultThermostatData: ThermostatData = {
  id: "e4d197aa-fa13-4255-b395-63268be12515",
  name: "Living Room",
  type: "thermostat",
  location: "Living Room",
  status: "active",
  provisioned: true,
  mode: "auto",
  setpoint: 25,
  setpoint_span: 2,
  interior_temperature: 21.5,
  exterior_temperature: 8.25,
  exterior_weather: "clear",
  dr_status: "normal",
};

const defaultCarChargerData: CarChargerData = {
  charge_percentage: 66.1,
  charge_rate: "medium",
  id: "f8204550-32cc-44aa-bf48-a95a90c1504f",
  location: "Living Room",
  name: "Linda's Charger",
  provisioned: true,
  status: "active",
  dr_status: "curtailed",
  type: "ev_charger",
  service: "unlimited",
};

const defaultHomeBatteryData: HomeBatteryData = {
  id: "e4d197aa-fa13-4255-b395-63268be12515",
  provisioned: true,
  name: "Home Battery",
  type: "home_battery",
  location: "Garage",
  status: "active",
  service: "unlimited",
  charge_rate: "high",
  charge_percentage: 78,
  reserve_limit: 20,
  dr_status: "normal",
};

const defaultHomeConfigData: HomeConfigData = {
  id: "a5e197aa-fa13-4255-b395-63268be12842",
  lpc_config: {
    name: "The Best LPC",
    status_communication: true,
    technical_contact: "phone",
    technical_phone: "+1-423-555-1212",
    technical_email: "contact@bestlpc.com",
    default_event_message: {
      title: "Demand Response in Progress",
      message: "Your home is participating in a demand response event, thank you for your participation.",
    },
    current_event_message: {
      title: "Demand Response: Current event",
      message: "This event is really wild, who knows when it will end, better put the kettle on.",
    },
  },
};

const factory = <T>(defaultData: T) => {
  return (data?: DeepPartial<T>) => merge(defaultData, data ?? {});
};

export const thermostatData = factory(defaultThermostatData);
export const carChargerData = factory(defaultCarChargerData);
export const homeBatteryData = factory(defaultHomeBatteryData);
export const homeConfigData = factory(defaultHomeConfigData);
