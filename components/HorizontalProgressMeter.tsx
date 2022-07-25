import React from "react";
import { StyleSheet, View } from "react-native";
import { theme, colors } from "../theme";
import LimitIndicator from "../assets/svg/limit-line.svg";

type HorizontalProgressMeterProps = {
  chargePercentage: number;
  reserveLimit?: number;
};

type HorizontalProgressMeterBarProps = {
  percentage: number;
};

const ProgressBar = ({ percentage }: HorizontalProgressMeterBarProps) => (
  <View style={[styles.progressBar, { width: `${percentage}%` }]} />
);

const ReserveLimitIndicator = ({ percentage }: HorizontalProgressMeterBarProps) => (
  <View style={[styles.reserveLimit, { marginLeft: `${percentage}%` }]}>
    <LimitIndicator />
  </View>
);

export const HorizontalProgressMeter = ({ chargePercentage, reserveLimit }: HorizontalProgressMeterProps) => {
  return (
    <View testID="HorizontalProgressMeter" style={styles.container}>
      <View style={styles.barContainer}>
        <ProgressBar percentage={chargePercentage} />
        <View style={styles.trackBar} />
        <View style={styles.reserveLimitContainer}>
          {reserveLimit !== undefined && <ReserveLimitIndicator percentage={reserveLimit} />}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 63,
    width: "100%",
    backgroundColor: theme.primary,
  },
  barContainer: {
    marginHorizontal: 2 * theme.padding,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.successGreen,
    position: "absolute",
    top: 29,
    zIndex: 2,
  },
  trackBar: {
    height: 4,
    backgroundColor: colors.neutralBlue,
    position: "absolute",
    top: 29,
    width: "100%",
    zIndex: 1,
  },
  reserveLimitContainer: { paddingRight: 8, position: "absolute", width: "100%" },
  reserveLimit: {
    width: 8,
    borderColor: theme.backdrop,
    zIndex: -1,
  },
});
