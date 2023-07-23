import React from "react";
import { Dimensions, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useWelcomeDismissed } from "../hooks/useAppStateData";
import { NavigationActions } from "react-navigation";
import {
  PanGestureHandler,
  State,
  PanGestureHandlerStateChangeEvent,
  PanGestureHandlerEventPayload,
  GestureEvent,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, { withTiming, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { MainNavigationProps } from "../types";
import { theme } from "../theme";

const HEIGHT = Dimensions.get("window").height;

export function DismissableSwipeResponder({ children }: { children: React.ReactNode }) {
  const { welcomeDismissedState, error, loading, getWelcomeDismissedState, setWelcomeDismissedEffect } = useWelcomeDismissed();
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

  const onGestureStateChange = async ({ nativeEvent }: PanGestureHandlerStateChangeEvent) => {
    const { state, translationY, y } = nativeEvent;

    if (state === State.BEGAN) {
      initialPosition.value = y;
    }

    if (state === State.END) {
      if (translationY < -200) {
        navigation.navigate("MacAddress");
        await setWelcomeDismissedEffect();
        position.value = 0;
      } else {
        position.value = withTiming(0, { duration: 100 });
      }
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <PanGestureHandler onGestureEvent={onGesture} onHandlerStateChange={onGestureStateChange}>
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <Animated.View style={[{ flex: 1 }, animatedStyle]}>{children}</Animated.View>
      </View>
    </PanGestureHandler>
    </GestureHandlerRootView>
  );
}
