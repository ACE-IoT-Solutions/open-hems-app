import { useState, useEffect } from "react";
import { getApiEndpoint, getJwt } from "../utils/api";

type UseDeviceDataOptions = {
  initialFetch: boolean;
};

export function useDeviceData<T>(id: string, { initialFetch }: UseDeviceDataOptions = { initialFetch: true }) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  async function getData() {
    try {
      setError(false);
      setLoading(true);

      const jwt = await getJwt();
      const endpoint = await getApiEndpoint();
      const response = await fetch(`${endpoint}/devices/${id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      setLoading(false);

      if (response.status !== 200) {
        throw new Error();
      } else {
        const data: T = await response.json();
        setData(data);
      }
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!data && initialFetch) {
      getData();
    }
  }, [initialFetch]);

  return { data, error, loading, getData };
}
