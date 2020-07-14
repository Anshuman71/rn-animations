import React, {useRef} from 'react';
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
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
  max,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  TouchableOpacity,
} from 'react-native-gesture-handler';

const {width, height} = Dimensions.get('window');
const DEFAULT_HEIGHT = height * 0.3;
const MIN_HEIGHT = height * 0.1;
const MAX_HEIGHT = height * 0.5;

const DARK = '#1e2c33';
const DARK_BG = '#0f1d24';
const TEAL = '#128C7E';
const TEAL_DARK = '#075E54';

export default function WhatsAppContact() {
  const translationY = useSharedValue(0);
  const maxTranslate = useSharedValue(MAX_HEIGHT);
  const imageHeight = useDerivedValue(() => {
    const newHeight = DEFAULT_HEIGHT - translationY.value;
    if (newHeight > MIN_HEIGHT && newHeight < MAX_HEIGHT) {
      return newHeight;
    } else if (newHeight >= MAX_HEIGHT) {
      return MAX_HEIGHT;
    } else {
      return MIN_HEIGHT;
    }
  });

  const opacity = useDerivedValue(() => {
    const range = DEFAULT_HEIGHT - MIN_HEIGHT;
    if (imageHeight.value >= DEFAULT_HEIGHT) {
      return 1;
    } else {
      return 1 - (DEFAULT_HEIGHT - imageHeight.value) / range;
    }
  });

  const containerY = useDerivedValue(() => {
    const isLess =
      translationY.value <= maxTranslate.value - (MAX_HEIGHT - MIN_HEIGHT);
    if (imageHeight.value <= MIN_HEIGHT && isLess) {
      return (-translationY.value);
    }
    return 0;
  });

  const textTranslate = useDerivedValue(() => {
    return (1 - opacity.value) * 10;
  });

  const panHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startY = -translationY.value;
    },
    onActive: (event, ctx) => {
      if (
        ctx.startY + event.translationY < MAX_HEIGHT - DEFAULT_HEIGHT &&
        maxTranslate.value >=
          height + MAX_HEIGHT - MIN_HEIGHT - (ctx.startY + event.translationY)
      ) {
        translationY.value = -(ctx.startY + event.translationY);
      }
    },
  });

  const headerStyle = useAnimatedStyle(() => {
    return {
      height: imageHeight.value,
      backgroundColor: DARK,
      ...StyleSheet.absoluteFill,
    };
  });

  const overlay = useAnimatedStyle(() => {
    return {
      flex: 1,
      opacity: opacity.value,
    };
  });
  const contentContainer = useAnimatedStyle(() => {
    return {
      flex: 1,
      backgroundColor: DARK_BG,
      minHeight: 1200,
      paddingVertical: 10,
      transform: [{translateY: containerY.value}],
    };
  });

  const title = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      bottom: 10,
      fontSize: 30,
      fontWeight: '900',
      color: 'white',
      left: 10,
      transform: [
        {translateX: textTranslate.value},
        {scale: 20 / (textTranslate.value + 20)},
      ],
    };
  });

  return (
    <View style={{flex: 1}}>
      <StatusBar translucent backgroundColor={DARK} />
      <PanGestureHandler onGestureEvent={panHandler}>
        <Animated.View style={{flex: 1}}>
          <Animated.View
            style={[
              {
                width,
                zIndex: 5,
              },
              headerStyle,
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
          <Animated.View
            onLayout={(event) => {
              maxTranslate.value = MAX_HEIGHT + event.nativeEvent.layout.height;
            }}
            style={contentContainer}>
            <View style={{flex: 1, paddingHorizontal: 10}}>
              <Text style={{color: TEAL, fontSize: 18}}>
                Media, links and docs
              </Text>
            </View>
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}
