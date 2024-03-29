import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme, typography } from "../../theme";
import { range } from "../../utils/visualization";
import { getLocalTemperature } from "../../utils/getLocalTemperature";
import { ThermostatGaugeButton } from "./ThermostatGaugeButton";
import ThermostatSetpoint from "../../assets/svg/thermostat-setpoint.svg";
import ThermostatDial from "../../assets/svg/thermostat-dial.svg";
import ThermostatUpIcon from "../../assets/svg/thermostat-up.svg";
import ThermostatDownIcon from "../../assets/svg/thermostat-down.svg";
import {
  GestureEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
  PanGestureHandlerStateChangeEvent,
  State,
} from "react-native-gesture-handler";

type ThermostatOnDragParams = {
  direction: "up" | "down";
  end: boolean;
};

type ThermostatGaugeProps = {
  label?: string;
  setPoint: number;
  interiorTemp: number;
  onPressWarm(): void;
  onPressCool(): void;
  onDrag(params: ThermostatOnDragParams): void;
  pendingActivity: boolean;
  disabled: boolean;
};

export const ThermostatGauge = ({
  disabled,
  label,
  setPoint,
  interiorTemp,
  onPressWarm,
  onPressCool,
  onDrag,
  pendingActivity,
}: ThermostatGaugeProps) => {
  const [isDraggingSetpoint, setIsDraggingSetpoint] = useState(false);
  const [dragY, setDragY] = useState(0);

  const maxTemp = 38;
  const minTemp = 8;

  const dialCenter = { left: 156, top: 157 };
  const dialRadius = 112;

  const scaledSetpoint = range(minTemp, maxTemp, -0.22 * Math.PI, 1.22 * Math.PI, setPoint);

  const setpointDotStyle = {
    left: dialCenter.left - dialRadius * Math.cos(scaledSetpoint),
    top: dialCenter.top - dialRadius * Math.sin(scaledSetpoint),
  };

  const onGesture = ({ nativeEvent }: GestureEvent<PanGestureHandlerEventPayload>) => {
    if (!isDraggingSetpoint || disabled) {
      return;
    }

    const dragDirection = dragY > nativeEvent.y ? "up" : "down";

    if (dragDirection === "up" && setPoint >= maxTemp) {
      return;
    }

    if (dragDirection === "down" && setPoint <= minTemp) {
      return;
    }

    onDrag({
      direction: dragDirection,
      end: false,
    });

    setDragY(nativeEvent.y);
  };

  const onGestureStateChange = ({ nativeEvent }: PanGestureHandlerStateChangeEvent) => {
    const { state } = nativeEvent;

    switch (state) {
      case State.BEGAN:
        setIsDraggingSetpoint(true);
        setDragY(nativeEvent.y);
        break;

      case State.FAILED:
        setIsDraggingSetpoint(false);
        break;

      case State.END:
        setIsDraggingSetpoint(false);
        break;
    }
  };

  return (
    <PanGestureHandler onGestureEvent={onGesture} onHandlerStateChange={onGestureStateChange}>
      <View style={styles.container}>
        <View style={styles.wrapper}>
          {label && <Text style={styles.label}>{label}</Text>}
          <Text style={[styles.setpoint, pendingActivity && styles.activeSetpoint, disabled && styles.disabled]}>
            {getLocalTemperature(setPoint)}&deg;
          </Text>
          <Text style={[styles.indoorTemp, disabled && styles.disabled]}>
            {getLocalTemperature(interiorTemp)}&deg; Indoor
          </Text>
          <View style={styles.controls}>
            <ThermostatGaugeButton
              label="Warm"
              icon={<ThermostatUpIcon />}
              disabled={disabled || setPoint >= maxTemp}
              onPress={onPressWarm}
            />
            <View style={styles.spacer} />
            <ThermostatGaugeButton
              label="Cool"
              icon={<ThermostatDownIcon />}
              disabled={disabled || setPoint <= minTemp}
              onPress={onPressCool}
            />
          </View>
        </View>
        <View style={styles.dialContainer}>
          <ThermostatDial />
          <View style={[{ position: "absolute" }, setpointDotStyle, pendingActivity && styles.activeSetpointDot]}>
            <ThermostatSetpoint />
          </View>
        </View>
      </View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    margin: "auto",
  },
  wrapper: {
    position: "absolute",
    flexDirection: "column",
    alignItems: "center",
    minWidth: 118,
  },
  label: {
    ...typography.headline3,
  },
  setpoint: {
    ...typography.headline1,
    color: theme.primary,
    textAlign: "center",
    width: "100%",
  },
  activeSetpoint: {
    shadowOpacity: 2,
    shadowColor: "#000000",
    shadowRadius: 0.4,
    shadowOffset: { height: 0, width: 0 },
  },
  activeSetpointDot: {
    shadowOpacity: 2,
    shadowColor: "#000000",
    shadowRadius: 0.6,
    shadowOffset: { height: 0, width: 0 },
  },
  disabled: {
    color: theme.disabledText,
  },
  indoorTemp: {
    ...typography.label,
    color: theme.primary,
  },
  controls: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 110,
    width: "100%",
  },
  spacer: {
    width: 12,
  },
  dialContainer: {
    zIndex: -1,
  },
});
