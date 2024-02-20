import AsyncStorage from "@react-native-async-storage/async-storage";
import { USER_API_PREFIX_KEY, JWT_TOKEN_KEY } from "../constants/api.constants";

export type ApiPrefixName = "digitalOcean" | "githubPages" | "localhost" | "customUrl";
export const githubPagesEndpoint = "https://carbonfive.github.io/open-hems-app";
export const defaultEndpoint = "https://open-hems.uc.r.appspot.com";
// export const defaultEndpoint = "http://192.168.100.99:5000";
// export const defaultEndpoint = "http://100.121.132.110:5000";

export const apiNamespace = "/api/v1";

async function getApiPrefix(key: string | null): Promise<string | null> {
  switch (key) {
    case "githubPages":
      return githubPagesEndpoint;
    case "localhost":
      const port = await AsyncStorage.getItem(key);
      return `http://localhost:${port}`;
    case "customUrl":
      return await AsyncStorage.getItem(key);
    default:
      return defaultEndpoint;
  }
}

export async function getApiEndpoint(): Promise<string | null> {
  const selectedPrefix = await AsyncStorage.getItem(USER_API_PREFIX_KEY);
  const fallbackPrefix = "digitalOcean";

  const apiEndpoint = await getApiPrefix(selectedPrefix ?? fallbackPrefix);

  return `${apiEndpoint}${apiNamespace}`;
}

export async function getJwt() {
  return (await AsyncStorage.getItem(JWT_TOKEN_KEY)) ?? "INVALID_TOKEN";
}

export async function setJwt(jwt: string) {
  await AsyncStorage.setItem(JWT_TOKEN_KEY, jwt);
}

export async function getWelcomeDismissed() {
  const welcomeDismissed = await AsyncStorage.getItem("welcomeDismissed");
  console.log("getWelcomeDismissed", welcomeDismissed);
  console.log("welcomeDismissedBoolean", (welcomeDismissed === "true"));
  return (welcomeDismissed) === "true";
}

export async function setWelcomeDismissed(welcomeDismissed: boolean) {
  console.log("setWelcomeDismissed", welcomeDismissed);
  await AsyncStorage.setItem("welcomeDismissed", welcomeDismissed.toString());
}

export async function getStorageMacAddress() {
  return (await AsyncStorage.getItem("macAddress")) ?? "INVALID_MAC_ADDRESS";
}
export async function getStorageMacAddressIfSet(defaultAddress: string) {
  return (await AsyncStorage.getItem("macAddress")) ?? defaultAddress;
}

export async function setStorageMacAddress(macAddress: string) {
  await AsyncStorage.setItem("macAddress", macAddress);
}

export async function setStorageMacAddressConfigured(macAddressConfigured: boolean) {
  await AsyncStorage.setItem("macAddressConfigured", macAddressConfigured.toString());
}

export async function getStorageMacAddressConfigured() {
  return ((await AsyncStorage.getItem("macAddressConfigured")) ?? "false") === "true";
}