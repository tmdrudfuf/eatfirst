import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useEffect } from 'react';
import { AppState, useColorScheme } from 'react-native';

import { Snackbar } from '@/components/Snackbar';
import { useTheme } from '@/constants/theme';
import { initAds } from '@/services/ads';
import { useFoods } from '@/stores/foodsStore';

export default function RootLayout() {
  const scheme = useColorScheme();
  const theme = useTheme();
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const refresh = useFoods((s) => s.refresh);

  // Load on launch and re-read on every foreground so "Today" stays correct across midnight.
  useEffect(() => {
    const load = () => refresh().catch((e) => console.error('Failed to load foods', e));
    load();
    initAds();
    const sub = AppState.addEventListener('change', (s) => s === 'active' && load());
    return () => sub.remove();
  }, [refresh]);

  return (
    <ThemeProvider
      value={{ ...base, colors: { ...base.colors, primary: theme.tint, background: theme.background } }}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="add" options={{ title: 'Add Food' }} />
        <Stack.Screen name="eat-by" options={{ title: 'Eat By' }} />
        <Stack.Screen name="food/[id]" options={{ title: '' }} />
        <Stack.Screen name="settings" options={{ title: 'Settings' }} />
      </Stack>
      <Snackbar />
    </ThemeProvider>
  );
}
