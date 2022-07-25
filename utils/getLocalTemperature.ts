import { round, toNumber } from "lodash";

// For some reason, Localization package is blowing up undefined constant.
// Temporarily disable Localization and assume always ºF.

// import * as Localization from "expo-localization";
// export const isMetric = Localization.isMetric;

export const isMetric = false;

export function getLocalTemperature(temperature: number | string | undefined): number | string | null {
  const tempString = String(temperature);

  if (!tempString) {
    return null;
  }

  const tempValue = toNumber(tempString);

  if (!tempValue) {
    return null;
  }

  return isMetric ? round(tempValue) : round(tempValue * (9 / 5) + 32);
}
