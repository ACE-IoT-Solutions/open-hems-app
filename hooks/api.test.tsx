import { renderHook } from "@testing-library/react-hooks";
import { useData } from "./api";

describe("useData hook", () => {
  type DataType = {
    message: string;
  };

  const id = "e4d197aa-fa13-4255-b395-63268be12515";
  const mockData = { message: "hello world" };
  const mockFetch = jest.fn().mockResolvedValue({ status: 200, json: () => mockData });
  global.fetch = mockFetch;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("toggles a loading state when fetching data", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useData<DataType>(id));
    expect(result.current.loading).toBeTruthy();

    await waitForNextUpdate();

    expect(result.current.loading).toBeFalsy();
  });

  it("fetches data from URL", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useData<DataType>("/some/url"));
    expect(result.current.loading).toBeTruthy();

    await waitForNextUpdate();

    expect(result.current.loading).toBeFalsy();
    expect(result.current.error).toBeFalsy();
    expect(result.current.data).toBeTruthy();
    expect(result.current.data).toStrictEqual(mockData);
  });

  it("sets an error state when failing to fetch data", async () => {
    const mockRejection = jest.fn().mockRejectedValue(new Error());
    global.fetch = mockRejection;

    const { result, waitForNextUpdate } = renderHook(() => useData<DataType>(id));
    expect(result.current.loading).toBeTruthy();

    await waitForNextUpdate();

    expect(mockRejection).toHaveBeenCalledTimes(1);
    expect(result.current.loading).toBeFalsy();
    expect(result.current.error).toBeTruthy();
    expect(result.current.data).toBeFalsy();
  });
});
