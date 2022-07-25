import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  globals: {
    __DEV__: true,
  },
  preset: "jest-expo",
  verbose: true,
  testEnvironment: "jsdom",
  transformIgnorePatterns: [
    "/node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg).+\\.(js|ts|tsx)$",
  ],
  moduleNameMapper: {
    "\\.svg": "<rootDir>/__mocks__/svgMock.ts",
  },
  setupFiles: ["./jest.setup.ts"],
};

export default config;
