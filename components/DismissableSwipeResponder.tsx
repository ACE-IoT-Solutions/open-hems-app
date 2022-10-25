import React from "react";
import { Dimensions, View } from "react-native";
import { Route, useNavigation, useNavigationState } from "@react-navigation/native";
import { NavigationActions } from "react-navigation";
import {
  PanGestureHandler,
  State,
  PanGestureHandlerStateChangeEvent,
  PanGestureHandlerEventPayload,
  GestureEvent,
} from "react-native-gesture-handler";
import Animated, { withTiming, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { MainNavigationProps } from "../types";
import { theme } from "../theme";

const HEIGHT = Dimensions.get("window").height;

export function DismissableSwipeResponder({ children }: { children: React.ReactNode }) {
  const navigation = useNavigation<MainNavigationProps>();
  const initialPosition = useSharedValue(0);
  const position = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: position.value }],
  }));

  const onGesture = ({ nativeEvent }: GestureEvent<PanGestureHandlerEventPayload>) => {
    if (nativeEvent.state === State.ACTIVE) {
      position.value = withTiming(nativeEvent.y - initialPosition.value, { duration: 50 });
    }
  };

  const onGestureStateChange = ({ nativeEvent }: PanGestureHandlerStateChangeEvent) => {
    const { state, translationY, y } = nativeEvent;

    if (state === State.BEGAN) {
      initialPosition.value = y;
    }

    if (state === State.END) {
      if (translationY < -200) {
        navigateToHome();
        position.value = HEIGHT;
      } else {
        position.value = withTiming(0, { duration: 100 });
      }
    }
  };

  function navigateToHome() {
    navigation.navigate(
      "AppNavigator",
      {},
      NavigationActions.navigate({
        routeName: "AppNavigator",
      })
    );
    return true;
  }

  return (
    <PanGestureHandler onGestureEvent={onGesture} onHandlerStateChange={onGestureStateChange}>
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <Animated.View style={[{ flex: 1 }, animatedStyle]}>{children}</Animated.View>
      </View>
    </PanGestureHandler>
  );
}
