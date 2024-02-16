import React, { ReactElement, useEffect, useState } from "react";
import { Text, View, StyleSheet, useWindowDimensions } from "react-native";
import { theme, typography, colors } from "../theme";
import Slider from "@react-native-community/slider";
import { ChargeRate } from "../types";
import { floor } from "lodash";

type ChargeRateSliderProps = {
  rates?: ChargeRate[];
  chargeRate?: ChargeRate;
  onSlidingComplete(rate: ChargeRate): void;
  children?: ReactElement;
};

function getChargeRateIndex(rates: string[], rawValue?: string): number {
  if (!rawValue) {
    return 0;
  } else {
    return rates.indexOf(rawValue);
  }
}

const rateLabelStyle = (rate: ChargeRate) => {
  const rateLabels: Record<ChargeRate, object> = {
    idle: styles.idleLabel,
    low: styles.lowLabel,
    medium: styles.mediumLabel,
    high: styles.highLabel,
  };

  return rateLabels[rate];
};

const scaleRateIndex = (index: number, ratesLength: number) => {
  if (ratesLength === 4) {
    return (
      {
        0: 0,
        1: 34,
        2: 68,
        3: 100,
      }[index] ?? 100
    );
  }

  return index * (100 / ratesLength);
};

const descaleRateIndex = (value: number, ratesLength: number) => {
  if (ratesLength === 4) {
    if (value < 18) {
      return 0;
    }

    if (value < 50) {
      return 1;
    }

    if (value < 85) {
      return 2;
    }

    return 3;
  }

  return floor(value / (100 / ratesLength));
};

export function ChargeRateSlider({
  rates = ["idle", "low", "medium", "high"],
  chargeRate,
  onSlidingComplete,
  children,
}: ChargeRateSliderProps) {
  const [sliderValue, setSliderValue] = useState<number>(
    scaleRateIndex(getChargeRateIndex(rates, chargeRate), rates.length)
  );

  const dimensions = useWindowDimensions();

  useEffect(() => setSliderValue(scaleRateIndex(getChargeRateIndex(rates, chargeRate), rates.length)), [chargeRate]);

  return (
    <View style={[styles.container, { width: dimensions.width - theme.padding * 2 }]}>
      <View style={styles.rates}>
        {rates.map((rate, i) => (
          <Text
            testID="ChargeRateSlider-rate-label"
            key={i}
            style={[styles.label, rateLabelStyle(rate)]}
            allowFontScaling={false}
          >
            {rate}
          </Text>
        ))}
      </View>

      <View testID="ChargeRateSlider-slider">
        <Slider
          value={sliderValue}
          minimumValue={0}
          maximumValue={100}
          minimumTrackTintColor={colors.white}
          maximumTrackTintColor={colors.white}
          thumbTintColor={colors.darkBlue}
          onValueChange={(value) => {
            setSliderValue(value);
          }}
          onSlidingComplete={(value) => {
            const rateIndex = descaleRateIndex(value, rates.length);
            setSliderValue(scaleRateIndex(rateIndex, rates.length));
            onSlidingComplete(rates[rateIndex]);
          }}
        />
      </View>

      {children && <View style={styles.childrenContainer}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 22,
    marginHorizontal: theme.padding,
    backgroundColor: theme.backdrop,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: colors.lightBlue,
    shadowRadius: 1,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowColor: colors.darkBlue15pct,
    elevation: 3,
  },
  rates: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    flex: 1,
    textAlign: "center",
    textTransform: "uppercase",
    marginBottom: theme.padding,
    ...typography.slider,
  },
  idleLabel: {
    textAlign: "left",
  },
  lowLabel: {
    width: "31%",
    position: "absolute",
    left: "19%",
    paddingHorizontal: "3%",
  },
  mediumLabel: {
    width: "31%",
    position: "absolute",
    right: "18%",
    paddingLeft: "3%",
  },
  highLabel: {
    textAlign: "right",
    position: "absolute",
    right: 0,
  },
  slider: {
    width: "100%",
  },
  childrenContainer: {
    marginTop: theme.padding,
  },
});
