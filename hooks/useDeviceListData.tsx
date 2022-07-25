import { useState, useEffect } from "react";
import { DeviceList, DeviceListResponse } from "../types";
import { getApiEndpoint, getJwt } from "../utils/api";

export function useDeviceListData() {
  const [data, setData] = useState<DeviceList>();
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  async function getData() {
    try {
      setError(false);
      setLoading(true);

      const jwt = await getJwt();
      const endpoint = await getApiEndpoint();
      const response = await fetch(`${endpoint}/devices/`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (response.status !== 200) {
        throw new Error(`Status ${response.status}`);
      } else {
        const data: DeviceListResponse = await response.json();

        for (const deviceIndex in data.devices) {
          const device = data.devices[deviceIndex];

          if (device.type === "solar_panels") {
            device.type = "pv_system";
          }
        }

        setData(data.devices);
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
  }, []);

  return { data, error, loading, getData };
}
