import * as Notifications from 'expo-notifications';
import Storage from 'expo-sqlite/kv-store';

import type { FoodItem } from '@/repositories/foodRepository';
import { dailySummaries } from '@/services/dailySummary';
import { addDays, parseDateKey, todayKey } from '@/utils/dates';

const CHANNEL_ID = 'daily-summary';
const DAYS_AHEAD = 7;

export type ReminderSettings = { enabled: boolean; hour: number; minute: number };

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export function getReminderSettings(): ReminderSettings {
  return {
    enabled: Storage.getItemSync('reminders.enabled') === '1',
    hour: Number(Storage.getItemSync('reminders.hour') ?? 9),
    minute: Number(Storage.getItemSync('reminders.minute') ?? 0),
  };
}

export function saveReminderSettings(s: ReminderSettings) {
  Storage.setItemSync('reminders.enabled', s.enabled ? '1' : '0');
  Storage.setItemSync('reminders.hour', String(s.hour));
  Storage.setItemSync('reminders.minute', String(s.minute));
}

// The contextual "Want Eat First to remind you?" prompt is shown at most once.
export const wasReminderPromptShown = () => Storage.getItemSync('reminders.prompted') === '1';
export const markReminderPromptShown = () => Storage.setItemSync('reminders.prompted', '1');

export type PermissionResult = 'granted' | 'denied' | 'blocked';

// Android 13+ only shows the OS prompt once a channel exists, so create it first.
export async function requestReminderPermission(): Promise<PermissionResult> {
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Daily summary',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return 'granted';
  if (!current.canAskAgain) return 'blocked';
  const res = await Notifications.requestPermissionsAsync();
  return res.granted ? 'granted' : res.canAskAgain ? 'denied' : 'blocked';
}

let queue: Promise<void> = Promise.resolve();

// A repeating trigger can't carry changing text, so: cancel everything and schedule one
// notification per upcoming day that has something due. Called after every data change,
// on every foreground and when settings change — at most one notification per day.
// Runs are serialized: overlapping cancel/schedule pairs would otherwise leave duplicates.
export function rescheduleReminders(foods: FoodItem[]): Promise<void> {
  queue = queue.catch(() => {}).then(() => reschedule(foods));
  return queue;
}

async function reschedule(foods: FoodItem[]) {
  await Notifications.cancelAllScheduledNotificationsAsync();
  const s = getReminderSettings();
  if (!s.enabled || !(await Notifications.getPermissionsAsync()).granted) return;

  const today = todayKey();
  const days = Array.from({ length: DAYS_AHEAD }, (_, i) => addDays(today, i));
  const now = Date.now();
  for (const { day, body } of dailySummaries(foods, days)) {
    const at = parseDateKey(day);
    at.setHours(s.hour, s.minute, 0, 0);
    if (at.getTime() <= now) continue;
    await Notifications.scheduleNotificationAsync({
      content: { title: 'Eat First', body },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: at, channelId: CHANNEL_ID },
    });
  }
}
