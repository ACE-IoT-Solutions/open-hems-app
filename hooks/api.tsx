import { useEffect, useState } from "react";
import { getApiEndpoint, getJwt } from "../utils/api";
import { ThermostatMode, ChargeRate, DemandResponseStatus, DeviceId, HemsData, Percentage } from "../types";

type UseUpdateOptions = {
  method?: "GET" | "POST" | "PATCH";
};

type UpdateResponse = {
  success: boolean;
};

export function useData<T>(route: string) {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  async function getData() {
    try {
      setError(false);
      setLoading(true);

      const jwt = await getJwt();
      const endpoint = await getApiEndpoint();
      const url = `${endpoint}${route}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (response.status !== 200) {
        throw new Error();
      } else {
        const data = await response.json();
        setData(data);
      }
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!data) {
      getData();
    }
  }, [data]);

  return { data, error, loading, getData };
}

export const useHemsData = () => useData<HemsData>("/hems/");

function useUpdate<T>(route: string, options: UseUpdateOptions = { method: "POST" }) {
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const update = async (payload: T): Promise<UpdateResponse> => {
    try {
      setError(false);
      setLoading(true);

      const jwt = await getJwt();
      const endpoint = await getApiEndpoint();
      const url = `${endpoint}${route}`;

      const response = await fetch(url, {
        body: JSON.stringify(payload),
        method: options.method,
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      });

      setError(response.status !== 200);
      return { success: response.status === 200 };
    } catch (error) {
      setError(true);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return { error, loading, update };
}

export type UpdateChargeRatePayload = {
  charge_rate: ChargeRate;
};

type HomeBatteryUpdateReserveLimitPayload = {
  reserve_limit: Percentage;
};
export const useHomeBatteryUpdateReserveLimit = (deviceId: DeviceId) =>
  useUpdate<HomeBatteryUpdateReserveLimitPayload>(`/devices/home_battery/${deviceId}/update_reserve_limit`);

export const useHomeBatteryUpdateChargeRate = (deviceId: DeviceId) =>
  useUpdate<UpdateChargeRatePayload>(`/devices/home_battery/${deviceId}/update_charge_rate`);

export const useEvChargerUpdateChargeRate = (deviceId: DeviceId) =>
  useUpdate<UpdateChargeRatePayload>(`/devices/ev_charger/${deviceId}/update_charge_rate`);

type HemsUpdateDerStatusPayload = {
  status: DemandResponseStatus;
};
export const useHemsUpdateDerStatus = (hemsId: DeviceId) =>
  useUpdate<HemsUpdateDerStatusPayload>(`/hems/${hemsId}/set_der_status`);

export type DeviceUpdateDerStatusPayload = {
  status: DemandResponseStatus;
};
export const useDeviceUpdateDerStatus = (deviceId: DeviceId) =>
  useUpdate<DeviceUpdateDerStatusPayload>(`/devices/${deviceId}/set_der_status`);

export type ThermostatUpdateSetPointPayload = {
  setpoint: number;
  mode: ThermostatMode;
};
export const useThermostatUpdateSetPoint = (deviceId: DeviceId) =>
  useUpdate<ThermostatUpdateSetPointPayload>(`/devices/thermostat/${deviceId}/update_setpoint`);
