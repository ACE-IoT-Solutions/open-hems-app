import AsyncStorage from "@react-native-async-storage/async-storage";
import { USER_API_PREFIX_KEY, JWT_TOKEN_KEY, FIRST_SECRET } from "../constants/api.constants";
import sign from "jwt-encode";

export type ApiPrefixName = "digitalOcean" | "githubPages" | "localhost" | "customUrl";
export const githubPagesEndpoint = "https://carbonfive.github.io/open-hems-app";
// export const digitalOceanEndpoint = "https://open-hems.uc.r.appspot.com";
export const digitalOceanEndpoint = "http://127.0.0.1:5000";

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
      return digitalOceanEndpoint;
  }
}

export async function getApiEndpoint(): Promise<string | null> {
  const selectedPrefix = await AsyncStorage.getItem(USER_API_PREFIX_KEY);
  const fallbackPrefix = "digitalOcean";

  const apiEndpoint = await getApiPrefix(selectedPrefix ?? fallbackPrefix);

  return `${apiEndpoint}${apiNamespace}`;
}

export async function getJwt() {
  const asyncJwt = (await AsyncStorage.getItem(JWT_TOKEN_KEY)) ?? "INVALID_TOKEN";
  console.log(asyncJwt);
  return asyncJwt;
}

export async function setJwt(jwt: string) {
  await AsyncStorage.setItem(JWT_TOKEN_KEY, jwt);
}

// export async function sendSecret(macAddress: string) {
//   const data = { authorized: true };
//   const secret = sign(data, FIRST_SECRET + macAddress);
//   try {
//     const url = await getApiEndpoint();
//     const endpoint = "/hems/generate_new_jwt";

//     const response = await fetch(url + endpoint, {
//       method: "POST",
//       body: JSON.stringify({
//         jwt: secret,
//       }),
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//       },
//     });

//     if (response.status !== 200) {
//       setJwt("INVALID_TOKEN");
//       console.log("not verified!");
//     } else {
//       const data = await response.json();
//       setJwt(data["jwt"]);
//       console.log("verified!");
//     }
//   } catch (error) {
//     console.log("Error: ", error);
//   }
// }
