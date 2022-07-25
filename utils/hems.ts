import { DemandResponseStatus } from "../types";

export const shouldPresentDemandResponse = (status?: DemandResponseStatus) => {
  if (!status) {
    return false;
  }

  return status !== "normal";
};
export const isActiveDemandResponseStatus = (status?: DemandResponseStatus) => {
  if (!status) {
    return false;
  }

  return status === "curtailed" || status === "heightened";
};
