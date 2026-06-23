import React from 'react';
import { Tabs } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';

export default function TabsLayout() {
  const { color } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: color.brand,
        tabBarInactiveTintColor: color.textMuted,
        tabBarStyle: { backgroundColor: color.surface, borderTopColor: color.border },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Portfolio' }} />
      <Tabs.Screen name="markets" options={{ title: 'Markets' }} />
    </Tabs>
  );
}
