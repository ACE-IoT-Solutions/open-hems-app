import { getApiEndpoint } from "./api";

describe("getApiEndpoint", () => {
  afterEach(jest.clearAllMocks);

  it("Defaults to Digital Ocean endpoint", async () => {
    expect(await getApiEndpoint()).toBe("https://open-hems.uc.r.appspot.com/api/v1");
  });
});
