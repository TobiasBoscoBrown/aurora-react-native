import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { ThemeProvider } from '@/theme/ThemeProvider';

export default function RootLayout() {
  // One client per app instance; tuned defaults for a mobile network profile.
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { retry: 2, refetchOnWindowFocus: false, gcTime: 5 * 60_000 } },
      }),
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={client}>
          <ThemeProvider>
            <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="asset/[id]" options={{ presentation: 'card' }} />
            </Stack>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
