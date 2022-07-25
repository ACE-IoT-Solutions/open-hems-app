import { PowerDataSamples } from "../types";

type GraphDataPoint = {
  x: number;
  y: number;
};

type GraphData = Array<GraphDataPoint>;

const baseLog = (base: number, x: number) => Math.log(x) / Math.log(base);

export const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;
export const invlerp = (x: number, y: number, a: number) => clamp((a - x) / (y - x));
export const clamp = (a: number, min = 0, max = 1) => Math.min(max, Math.max(min, a));
export const range = (x1: number, y1: number, x2: number, y2: number, a: number) => lerp(x2, y2, invlerp(x1, y1, a));

export const upperBounds = (data: Array<number>) => {
  const dataMax = data.reduce((max, n) => Math.max(max, n), 0);
  if (dataMax == 0) {
    return 10;
  }

  const maxPower = Math.floor(baseLog(10, dataMax));
  const upperBound = Math.ceil(dataMax / 10 ** maxPower) * 10 ** maxPower;
  return upperBound;
};

export const preparePowerData = (samples: PowerDataSamples, date = new Date()): GraphData => {
  const dateString = date.toDateString();
  const samplesForDate = samples.filter(({ timestamp }) => timestamp.toDateString() === dateString);

  // 1h period
  return samplesForDate.map(({ timestamp, power }) => {
    return {
      x: timestamp.getHours(),
      y: power,
    };
  });
};

export const sanitize = (data: GraphData): GraphData => {
  if (data.length == 0) {
    return [{ x: 0, y: 0 }];
  } else {
    return data;
  }
};
