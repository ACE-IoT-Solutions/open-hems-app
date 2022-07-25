import { round, toNumber, isNumber } from "lodash";

export function getTemperature(temp: number | undefined): number | null {
  const tempString = String(temp);

  if (!tempString) {
    return null;
  }

  const value = round(toNumber(temp), 0);

  if (!isNumber(value)) {
    return null;
  } else {
    return value;
  }
}
