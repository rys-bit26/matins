import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useFonts,
  Cormorant_400Regular,
  Cormorant_400Regular_Italic,
  Cormorant_500Medium,
  Cormorant_600SemiBold,
  Cormorant_700Bold,
} from '@expo-google-fonts/cormorant';
import * as SplashScreen from 'expo-splash-screen';
import { Platform } from 'react-native';
import { colors } from '../src/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Cormorant_400Regular,
    Cormorant_400Regular_Italic,
    Cormorant_500Medium,
    Cormorant_600SemiBold,
    Cormorant_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background.primary },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="office/[type]"
          options={{
            presentation: 'fullScreenModal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="reading/[ref]"
          options={{
            presentation: 'card',
            headerShown: true,
            headerStyle: { backgroundColor: colors.background.secondary },
            headerTintColor: colors.text.primary,
            headerTitle: '',
          }}
        />
        <Stack.Screen
          name="psalm/[id]"
          options={{
            presentation: 'card',
            headerShown: true,
            headerStyle: { backgroundColor: colors.background.secondary },
            headerTintColor: colors.text.primary,
            headerTitle: '',
          }}
        />
        <Stack.Screen
          name="devotional/[slug]"
          options={{ presentation: 'card' }}
        />
        <Stack.Screen
          name="calendar/[date]"
          options={{ presentation: 'card' }}
        />
        <Stack.Screen
          name="learn/index"
          options={{ presentation: 'card' }}
        />
        <Stack.Screen
          name="learn/[topic]"
          options={{ presentation: 'card' }}
        />
        <Stack.Screen
          name="onboarding/index"
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name="sacred-space"
          options={{
            presentation: 'modal',
            headerShown: true,
            headerStyle: { backgroundColor: colors.background.secondary },
            headerTintColor: colors.text.primary,
            headerTitle: '',
          }}
        />
      </Stack>
    </QueryClientProvider>
  );
}
