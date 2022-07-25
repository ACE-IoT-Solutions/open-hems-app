import { act } from "react-test-renderer";
import { renderHook } from "@testing-library/react-hooks";
import { useDeviceData } from "./useDeviceData";
import { ThermostatData } from "../types";
import * as mockThermostatData from "../docs/api/v1/devices/e4d197aa-fa13-4255-b395-63268be12515/index.json";
import { DEFAULT_COJOURN_JWT_TOKEN } from "../constants/api.constants";

describe("useDeviceData hook", () => {
  const id = "e4d197aa-fa13-4255-b395-63268be12515";
  const headers = {
    headers: {
      Authorization: `Bearer ${DEFAULT_COJOURN_JWT_TOKEN}`,
    },
  };
  const getGithubPagesEndpoint = (id: string) => `https://cojourn-buu38.ondigitalocean.app/api/v1/devices/${id}`;

  const mockFetch = jest.fn(() => {
    return Promise.resolve({
      status: 200,
      json: () => Promise.resolve(mockThermostatData),
    } as unknown as Response);
  });

  beforeEach(async () => {
    global.fetch = mockFetch;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("toggles a loading state when fetching data", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useDeviceData<ThermostatData>(id));
    expect(result.current.loading).toBeTruthy();

    await waitForNextUpdate();

    expect(mockFetch).toHaveBeenCalledWith(getGithubPagesEndpoint(id), headers);
    expect(result.current.loading).toBeFalsy();
  });

  it("fetches a device's data by a given id", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useDeviceData<ThermostatData>(id));
    expect(result.current.loading).toBeTruthy();

    await waitForNextUpdate();

    expect(mockFetch).toHaveBeenCalledWith(getGithubPagesEndpoint(id), headers);
    expect(result.current.loading).toBeFalsy();
    expect(result.current.error).toBeFalsy();
    expect(result.current.data).toBeTruthy();
    expect(result.current.data).toStrictEqual(mockThermostatData);
  });

  it("sets an error state when failing to fetch data", async () => {
    const mockRejection = jest.fn().mockRejectedValue(new Error());
    global.fetch = mockRejection;

    const { result, waitForNextUpdate } = renderHook(() => useDeviceData<ThermostatData>(id));
    expect(result.current.loading).toBeTruthy();

    await waitForNextUpdate();

    expect(mockRejection).toHaveBeenCalledTimes(1);
    expect(result.current.loading).toBeFalsy();
    expect(result.current.error).toBeTruthy();
    expect(result.current.data).toBeFalsy();
  });

  describe("when called with initialFetch = false", () => {
    it("does not initally call fetch", async () => {
      const { result } = renderHook(() => useDeviceData<ThermostatData>(id, { initialFetch: false }));
      expect(mockFetch).not.toHaveBeenCalled();
      const { data, loading, error } = result.current;
      expect(data).toBeFalsy();
      expect(loading).toBeFalsy();
      expect(error).toBeFalsy();
    });

    it("exposes getData", async () => {
      const { result } = renderHook(() => useDeviceData<ThermostatData>(id, { initialFetch: false }));
      expect(mockFetch).not.toHaveBeenCalled();
      expect(result.current.loading).toBeFalsy();

      await act(() => result.current.getData());
      expect(mockFetch).toHaveBeenCalled();
      expect(result.current.data).toBeTruthy();
    });
  });
});
