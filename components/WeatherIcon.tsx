import React, { FC } from "react";
import Sun from "../assets/svg/weather/sun.svg";
import Wind from "../assets/svg/weather/wind.svg";
import PartiallySunny from "../assets/svg/weather/partially-sunny.svg";
import Cloudy from "../assets/svg/weather/cloudy.svg";
import Rainy from "../assets/svg/weather/cloud-rain-light.svg";
import { SvgProps } from "react-native-svg";
import { Weather } from "../types";

const weatherSvgRecord: Record<Weather, FC<SvgProps>> = {
  clear: Sun,
  windy: Wind,
  cloudy: Cloudy,
  partly_cloudy: PartiallySunny,
  rainy: Rainy,
};
type WeatherIconProps = { weather: Weather; testID: string };
export function WeatherIcon({ weather, testID }: WeatherIconProps) {
  const WeatherSvg = weatherSvgRecord[weather];

  return <WeatherSvg testID={testID} />;
}
