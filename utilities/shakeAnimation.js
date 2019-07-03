import { Animated } from 'react-native';

export const shakeAnimation = value => Animated.sequence([
  Animated.timing(value, {
    toValue: 50,
    duration: 100,
    useNativeDrivers: true,
  }),
  Animated.timing(value, {
    toValue: -50,
    duration: 100,
    useNativeDrivers: true,
  }),
  Animated.timing(value, {
    toValue: 50,
    duration: 100,
    useNativeDrivers: true,
  }),
  Animated.timing(value, {
    toValue: -50,
    duration: 100,
    useNativeDrivers: true,
  }),
  Animated.timing(value, {
    toValue: 0,
    duration: 100,
    useNativeDrivers: true,
  }),
]).start();
