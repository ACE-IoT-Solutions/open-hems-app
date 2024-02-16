import { Dimensions, StyleSheet } from "react-native";

export const colors = {
  darkBlue: "#075EA3",
  darkBlue15pct: "rgba(23, 11, 71, 0.15)",
  darkBlue38pct: "rgba(23, 11, 71, 0.38)",
  greyBlue: "#696A86",
  lightBlue: "#F1F9FE",
  neutralBlue: "#CDDFED",
  white: "#FFFFFF",
  errorRed: "#B00202",
  orange: "#FD8218",
  successGreen: "#2E9145",
  periwinkle: "#9E92CE",

  thermostatModes: {
    auto: "#A1A1A1",
    heat: "#F15A29",
    cool: "#2E3192",
    eco: "#2E9145",
  },
};

const fonts = {
  rubik300: "Rubik_300Light",
  rubik400: "Rubik_400Regular",
  rubik500: "Rubik_500Medium",
};

export const theme = {
  background: colors.lightBlue,
  backgroundMask: colors.darkBlue38pct,
  backdrop: colors.neutralBlue,
  primary: colors.darkBlue,
  text: colors.darkBlue,
  disabledText: colors.greyBlue,

  colors: {
    red: colors.errorRed,
    orange: colors.orange,
    white: colors.white,
    periwinkle: colors.periwinkle,
  },

  fonts: {
    regular: fonts.rubik400,
    title: fonts.rubik500,
  },

  padding: 15,
  windowWidth: Dimensions.get("window").width,
};

export const typography = StyleSheet.create({
  headline1: {
    fontFamily: fonts.rubik300,
    fontSize: 60,
  },

  headline1Bold: {
    fontFamily: fonts.rubik400,
    fontSize: 60,
  },

  headline2: {
    fontFamily: fonts.rubik400,
    fontSize: 18,
  },

  headline3: {
    fontFamily: fonts.rubik400,
    fontSize: 16,
    color: colors.darkBlue,
  },

  headline3Bold: {
    fontFamily: fonts.rubik500,
    fontSize: 16,
  },

  label: {
    color: theme.text,
    fontFamily: fonts.rubik400,
    fontSize: 12,
    letterSpacing: 0.08,
  },

  slider: {
    color: theme.text,
    fontFamily: fonts.rubik400,
    fontSize: 14,
    letterSpacing: 0.08,
  },

  text: {
    color: theme.text,
    fontFamily: fonts.rubik400,
    fontSize: 16,
  },

  errorText: {
    color: colors.errorRed,
    fontFamily: fonts.rubik400,
    fontSize: 16,
  },

  smallErrorText: {
    color: colors.errorRed,
    fontFamily: fonts.rubik400,
    fontSize: 12,
  },
});
