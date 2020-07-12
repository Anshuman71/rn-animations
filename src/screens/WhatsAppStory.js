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

  return (
    <View style={{flex: 1, justifyContent: 'center', backgroundColor: 'grey'}}>
      <StatusBar translucent backgroundColor="#000000" />
      <TouchableOpacity onPress={() => (y.value = 0)}>
        <Text>Reset</Text>
      </TouchableOpacity>
      <Animated.View
        style={[
          {
            width,
            height,
            position: 'absolute',
            top: 0,
            zIndex: 2,
            right: 0,
            backgroundColor: 'black',
          },
          background,
        ]}></Animated.View>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.Image
          style={[
            {
              width,
              height: height / 2.5,
              position: 'absolute',
              top: TOP,
              zIndex: 5,
              backgroundColor: 'black',
            },
            animatedStyle,
          ]}
          source={{
            uri:
              'https://images.unsplash.com/photo-1583439869427-bcdd24516ad9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80',
          }}
        />
      </PanGestureHandler>
    </View>
  );
}
