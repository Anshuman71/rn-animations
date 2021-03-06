import React from 'react';
import {Dimensions, View, StatusBar, Text} from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  withSpring,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  useDerivedValue,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import WhatsAppContact from './src/screens/WhatsAppContact';

const {width, height} = Dimensions.get('window');
const TOP = height * 0.3;

export default function App() {
  const y = useSharedValue(0);
  const opacity = useDerivedValue(() => {
    const res = y.value / 100;
    return 1 - res > 0.1 ? Math.abs(1 - res) : 0;
  });

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startY = y.value;
    },
    onActive: (event, ctx) => {
      if (
        (ctx.startY > 0 && event.translationY > -100) ||
        event.translationY > 0
      ) {
        y.value = ctx.startY + event.translationY;
      }
    },
    onEnd: (event) => {
      if (y.value > 150 && event.velocityY > 150) {
        y.value = withSpring(height - TOP);
      } else {
        y.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: y.value,
        },
      ],
    };
  });

  const background = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return <WhatsAppContact />;
}
