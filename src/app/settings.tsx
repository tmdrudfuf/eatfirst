import Constants from 'expo-constants';
import { ScrollView, Text } from 'react-native';

import { useTheme } from '@/constants/theme';

export default function SettingsScreen() {
  const theme = useTheme();
  return (
    <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={{ padding: 16, gap: 16 }}>
      <Text style={{ color: theme.textSecondary, fontSize: 14 }}>
        Eat First {Constants.expoConfig?.version} · Your food list stays on this device.
      </Text>
    </ScrollView>
  );
}
