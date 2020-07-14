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
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const {width, height} = Dimensions.get('window');
const MIN_HEIGHT = height * 0.075;
const DEFAULT_HEIGHT = height * 0.35;
const MAX_HEIGHT = height * 0.5;

const DARK = '#1e2c33';
const DARK_BG = '#0f1d24';
const TEAL = '#128C7E';
const TEAL_DARK = '#075E54';

const config = {
  damping: 15,
};

export default function WhatsAppContact() {
  const imageHeight = useSharedValue(DEFAULT_HEIGHT);

  const opacity = useDerivedValue(() => {
    const range = DEFAULT_HEIGHT - MIN_HEIGHT;
    if (imageHeight.value >= DEFAULT_HEIGHT) {
      return 0;
    }
    return (DEFAULT_HEIGHT - imageHeight.value) / range;
  });

  const textTranslate = useDerivedValue(() => {
    return opacity.value * 10;
  });

  const gestureHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      let newValue = event.contentOffset.y;
      if (newValue > 0) {
        newValue = imageHeight.value - newValue;
      } else if (newValue === 0) {
        newValue = MAX_HEIGHT;
      } else {
        newValue = imageHeight.value + newValue;
      }
      if (newValue <= MIN_HEIGHT) {
        newValue = MIN_HEIGHT;
      }
      imageHeight.value = withSpring(newValue, config);
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      top: 24,
      left: 0,
      height: imageHeight.value,
      width,
      backgroundColor: DARK,
    };
  });

  const content = useAnimatedStyle(() => {
    return {
      paddingTop: imageHeight.value,
      backgroundColor: DARK_BG,
    };
  });

  const overlay = useAnimatedStyle(() => {
    return {
      flex: 1,
      opacity: 1 - opacity.value,
      backgroundColor: DARK,
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
      zIndex: 10,
      transform: [
        {translateX: textTranslate.value},
        {scale: 20 / (textTranslate.value + 20)},
      ],
    };
  });

  return (
    <View style={styles.screen}>
      <StatusBar translucent backgroundColor="#000000" />
      <Animated.ScrollView style={content} onScroll={gestureHandler}>
        <View style={{height: height * 2, width}}>
          {/* <Text style={{fontSize: 25, color: 'white'}}>Hellow</Text> */}
        </View>
      </Animated.ScrollView>
      <Animated.View style={[animatedStyle]}>
        <Animated.Image
          source={{
            uri:
              'https://images.unsplash.com/photo-1594409855476-29909f35c73c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80',
          }}
          resizeMode="cover"
          style={overlay}
        />
        <Animated.Text style={title}>Madhav Kaushik</Animated.Text>
        <View style={styles.topBar}>
          <Image style={styles.icons} source={require('../icons/back.png')} />
          <Image
            style={[styles.icons, {marginRight: 10}]}
            source={require('../icons/more.png')}
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    top: 0,
    width,
    left: 10,
    height: MIN_HEIGHT,
    zIndex: 10,
  },
  icons: {height: 24, width: 24},
  screen: {flex: 1, justifyContent: 'center'},
});
