import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { useTheme } from '@/constants/theme';
import {
  getReminderSettings,
  markReminderPromptShown,
  requestReminderPermission,
  saveReminderSettings,
  wasReminderPromptShown,
} from '@/services/notificationService';
import { useFoods } from '@/stores/foodsStore';

const MIN_FOODS = 3;

// Contextual permission ask: only after the user has a few foods, and only once.
export function ReminderPrompt() {
  const theme = useTheme();
  const { foods, refresh, showMessage } = useFoods();
  const [hidden, setHidden] = useState(() => wasReminderPromptShown() || getReminderSettings().enabled);

  if (hidden || foods.length < MIN_FOODS) return null;

  const close = () => {
    markReminderPromptShown();
    setHidden(true);
  };

  const accept = async () => {
    close();
    const result = await requestReminderPermission().catch(() => 'denied' as const);
    if (result === 'granted') {
      saveReminderSettings({ ...getReminderSettings(), enabled: true });
      await refresh().catch(() => {});
      showMessage('Daily reminder on. Change the time in Settings.');
    } else {
      showMessage('Reminders are off. You can turn them on in Settings.');
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.backgroundElement }]}>
      <Text style={[styles.title, { color: theme.text }]}>Want Eat First to remind you?</Text>
      <Text style={{ color: theme.textSecondary, fontSize: 15, lineHeight: 21 }}>
        One short summary a day, only when food is due.
      </Text>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <PrimaryButton label="Not now" variant="secondary" onPress={close} />
        </View>
        <View style={{ flex: 1 }}>
          <PrimaryButton label="Remind me" onPress={accept} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { margin: 16, marginBottom: 0, padding: 16, borderRadius: 14, gap: 8 },
  title: { fontSize: 17, fontWeight: '600' },
  row: { flexDirection: 'row', gap: 10, marginTop: 8 },
});
