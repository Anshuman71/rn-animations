import React from 'react';
import {
  Dimensions,
  View,
  StyleSheet,
  Image,
  StatusBar,
  Text,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  TouchableOpacity,
} from 'react-native-gesture-handler';

const {width, height} = Dimensions.get('window');
const DEFAULT_HEIGHT = height * 0.3;
const MIN_HEIGHT = height * 0.1;
const MAX_HEIGHT = height * 0.5;

export default function WhatsAppContact() {
  const translationY = useSharedValue(0);
  const imageHeight = useDerivedValue(() => {
    if (DEFAULT_HEIGHT - translationY.value > MIN_HEIGHT) {
      return DEFAULT_HEIGHT - translationY.value;
    } else {
      return MIN_HEIGHT;
    }
  });

  const opacity = useDerivedValue(() => {
    const range = DEFAULT_HEIGHT - MIN_HEIGHT;
    return 1 - (DEFAULT_HEIGHT - imageHeight.value) / range;
  });

  const textTranslate = useDerivedValue(() => {
    return (1 - opacity.value) * 10;
  });

  const gestureHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      translationY.value = event.contentOffset.y;
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: imageHeight.value,
      backgroundColor: 'green',
      transform: [
        {
          translateY: translationY.value,
        },
      ],
    };
  });

  const overlay = useAnimatedStyle(() => {
    return {
      ...StyleSheet.absoluteFill,
      height: imageHeight.value,
      opacity: opacity.value,
    };
  });

  const title = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      bottom: 10,
      fontSize: 30,
      fontWeight: '900',
      color: 'white',
      left: 20,
      transform: [
        {translateX: textTranslate.value},
        {scale: 20 / (textTranslate.value + 20)},
      ],
    };
  });

  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <StatusBar translucent backgroundColor="#000000" />
      <Animated.ScrollView onScroll={gestureHandler}>
        <Animated.View
          style={[
            {
              width,
              zIndex: 5,
            },
            animatedStyle,
          ]}>
          <Animated.Image
            source={{
              uri:
                'https://images.unsplash.com/photo-1594409855476-29909f35c73c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80',
            }}
            resizeMode="cover"
            style={overlay}
          />
          <Animated.Text style={title}>Madhav Kaushik</Animated.Text>
        </Animated.View>
        <View style={{height: height * 2, width, backgroundColor: 'orange'}} />
      </Animated.ScrollView>
    </View>
  );
}
