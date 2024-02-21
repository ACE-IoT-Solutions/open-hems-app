import React from "react";
import { View } from "react-native";
import { Route, useNavigation, useNavigationState, useRoute } from "@react-navigation/native";
import {
  PanGestureHandler,
  State,
  PanGestureHandlerStateChangeEvent,
  PanGestureHandlerEventPayload,
  GestureEvent,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, { withTiming, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { DeviceNavigationProps, DeviceScreenRouteProps } from "../types";
import { theme } from "../theme";

export function NavigationSwipeResponder({ children }: { children: React.ReactNode }) {
  const route = useRoute<DeviceScreenRouteProps>();
  const navigation = useNavigation<DeviceNavigationProps>();
  const siblingNavigationRoutes: Array<Route<DeviceScreenRouteProps>> = useNavigationState((state) => state.routes);

  const initialPosition = useSharedValue(0);
  const position = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value }],
  }));

  const onGesture = ({ nativeEvent }: GestureEvent<PanGestureHandlerEventPayload>) => {
    if (nativeEvent.state === State.ACTIVE) {
      position.value = withTiming(nativeEvent.x - initialPosition.value, { duration: 50 });
    }
  };

  const onGestureStateChange = ({ nativeEvent }: PanGestureHandlerStateChangeEvent) => {
    const { state, translationX, x } = nativeEvent;

    if (state === State.BEGAN) {
      initialPosition.value = x;
    }

    if (state === State.END) {
      if (Math.abs(translationX) > 70) {
        const didNavigate = translationX > 0 ? onRightSwipe() : onLeftSwipe();
        if (didNavigate) {
          position.value = 0;
        } else {
          position.value = withTiming(0, { duration: 100 });
        }
      } else {
        position.value = withTiming(0, { duration: 100 });
      }
    }
  };

  function navigateToNeighbor(increment: boolean) {
    const siblingRoute = siblingNavigationRoutes.find((siblingRoute) => siblingRoute.key === route.key);
    if (!siblingRoute) {
      return false;
    }

    const routeIndex = siblingNavigationRoutes.indexOf(siblingRoute);
    const nextRouteIndex = routeIndex + (increment ? 1 : -1);
    const nextRoute = siblingNavigationRoutes[nextRouteIndex];

    if (!nextRoute) {
      return false;
    }

    navigation.navigate(nextRoute.name, nextRoute.params);
    return true;
  }

  function onRightSwipe() {
    return navigateToNeighbor(false);
  }

  function onLeftSwipe() {
    return navigateToNeighbor(true);
  }

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
