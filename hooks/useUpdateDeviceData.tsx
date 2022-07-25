import { useState } from "react";
import { getApiEndpoint, getJwt } from "../utils/api";
import { DeviceId } from "../types";

export function useUpdateDeviceData<T>(id: DeviceId) {
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const updateDeviceData = async (data: Partial<T>) => {
    try {
      setError(false);
      setLoading(true);

      const jwt = await getJwt();
      const endpoint = await getApiEndpoint();
      const response = await fetch(`${endpoint}/devices/${id}`, {
        body: JSON.stringify(data),
        method: "PATCH",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (response.status !== 200) {
        throw new Error("Could not update device data");
      }
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return { error, loading, updateDeviceData };
}
