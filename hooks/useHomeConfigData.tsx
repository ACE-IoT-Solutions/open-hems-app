import { useState } from "react";
import { getApiEndpoint } from "../utils/api";
import { DEFAULT_COJOURN_JWT_TOKEN } from "../constants/api.constants";
import { HomeConfigData } from "../types";

export function useHomeConfigData() {
  const [data, setData] = useState<HomeConfigData>();
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  async function getData() {
    try {
      setError(false);
      setLoading(true);

      const endpoint = await getApiEndpoint();
      const response = await fetch(`${endpoint}/home/config`, {
        headers: {
          Authorization: `Bearer ${DEFAULT_COJOURN_JWT_TOKEN}`,
        },
      });
      setLoading(false);

      if (response.status !== 200) {
        throw new Error();
      } else {
        const data = await response.json();
        const { home } = data;
        setData(home);
      }
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  }

  return { data, error, loading, getData };
}
