import React, { useEffect } from 'react';
import { TextStyle } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedProps, withTiming, Easing,
} from 'react-native-reanimated';
import { TextInput } from 'react-native';
import { formatUsd } from '@/utils/format';

Animated.addWhitelistedNativeProps({ text: true });
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

/**
 * Smoothly tweens a currency value on the UI thread by driving an (uneditable)
 * TextInput's `text` prop from a worklet — zero JS-thread re-renders per frame.
 */
export function AnimatedNumber({ value, style }: { value: number; style?: TextStyle }) {
  const v = useSharedValue(value);
  useEffect(() => {
    v.value = withTiming(value, { duration: 650, easing: Easing.out(Easing.cubic) });
  }, [value, v]);

  const props = useAnimatedProps(() => ({ text: formatUsd(v.value), defaultValue: formatUsd(v.value) }));
  return (
    <AnimatedTextInput
      editable={false}
      underlineColorAndroid="transparent"
      style={[{ padding: 0 }, style]}
      // @ts-expect-error — `text` is whitelisted above for the worklet bridge.
      animatedProps={props}
    />
  );
}
