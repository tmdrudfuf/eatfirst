import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import Constants from 'expo-constants';
import { useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { useTheme } from '@/constants/theme';
import { showAdPrivacyOptions, useAds } from '@/services/ads';
import {
  getReminderSettings,
  markReminderPromptShown,
  requestReminderPermission,
  rescheduleReminders,
  saveReminderSettings,
  type ReminderSettings,
} from '@/services/notificationService';
import { useFoods } from '@/stores/foodsStore';

const formatTime = (hour: number, minute: number) =>
  new Date(2000, 0, 1, hour, minute).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

export default function SettingsScreen() {
  const theme = useTheme();
  const [settings, setSettings] = useState(getReminderSettings);
  const privacyOptionsRequired = useAds((s) => s.privacyOptionsRequired);

  const apply = (next: ReminderSettings) => {
    saveReminderSettings(next);
    setSettings(next);
    rescheduleReminders(useFoods.getState().foods).catch((e) => console.warn('Reminder scheduling failed', e));
  };

  const toggle = async (on: boolean) => {
    if (!on) return apply({ ...settings, enabled: false });
    markReminderPromptShown();
    const result = await requestReminderPermission();
    if (result === 'granted') return apply({ ...settings, enabled: true });
    if (result === 'blocked') {
      Alert.alert('Notifications are blocked', 'Allow notifications for Eat First in system settings.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open settings', onPress: () => Linking.openSettings() },
      ]);
    }
  };

  const pickTime = () =>
    DateTimePickerAndroid.open({
      value: new Date(2000, 0, 1, settings.hour, settings.minute),
      mode: 'time',
      onValueChange: (_e, d) => apply({ ...settings, hour: d.getHours(), minute: d.getMinutes() }),
    });

  return (
    <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={{ paddingVertical: 8 }}>
      <Text style={[styles.section, { color: theme.textSecondary }]}>Reminders</Text>
      <View style={[styles.row, { borderBottomColor: theme.border }]}>
        <Text style={[styles.label, { color: theme.text }]}>Daily summary</Text>
        <Switch
          value={settings.enabled}
          onValueChange={toggle}
          accessibilityLabel="Daily summary"
          trackColor={{ true: theme.tint }}
        />
      </View>
      <Pressable
        onPress={pickTime}
        disabled={!settings.enabled}
        accessibilityRole="button"
        accessibilityLabel={`Reminder time, ${formatTime(settings.hour, settings.minute)}`}
        style={[styles.row, { borderBottomColor: theme.border, opacity: settings.enabled ? 1 : 0.4 }]}>
        <Text style={[styles.label, { color: theme.text }]}>Time</Text>
        <Text style={{ color: theme.textSecondary, fontSize: 17 }}>{formatTime(settings.hour, settings.minute)}</Text>
      </Pressable>
      <Text style={[styles.note, { color: theme.textSecondary }]}>
        At most one notification a day, only when food is due that day or earlier.
      </Text>

      {privacyOptionsRequired && (
        <Pressable
          onPress={() => showAdPrivacyOptions().catch(() => {})}
          accessibilityRole="button"
          style={[styles.row, { borderBottomColor: theme.border, marginTop: 16 }]}>
          <Text style={[styles.label, { color: theme.text }]}>Ad privacy options</Text>
        </Pressable>
      )}

      <Text style={[styles.note, { color: theme.textSecondary, marginTop: 24 }]}>
        Eat First {Constants.expoConfig?.version} · Your food list is stored only on this device.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  section: { fontSize: 14, fontWeight: '600', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 6 },
  row: {
    minHeight: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  label: { fontSize: 17 },
  note: { fontSize: 14, lineHeight: 20, paddingHorizontal: 16, paddingTop: 10 },
});
