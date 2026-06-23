import React from 'react';
import { View, ViewProps } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

export function Card({ style, ...rest }: ViewProps) {
  const { color, radius, space } = useTheme();
  return (
    <View
      {...rest}
      style={[
        {
          backgroundColor: color.surface,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: color.border,
          padding: space.lg,
        },
        style,
      ]}
    />
  );
}
