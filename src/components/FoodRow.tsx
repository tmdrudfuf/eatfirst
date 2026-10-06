import { router } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { useTheme } from '@/constants/theme';
import type { FoodItem } from '@/repositories/foodRepository';
import { daysUntil, relativeLabel } from '@/utils/dates';

export function FoodRow({ food, today }: { food: FoodItem; today: string }) {
  const theme = useTheme();
  const days = daysUntil(food.eat_by, today);
  const label = relativeLabel(days);

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/food/[id]', params: { id: food.id } })}
      accessibilityRole="button"
      accessibilityLabel={`${food.name}, ${label}`}
      style={({ pressed }) => [
        styles.row,
        { borderBottomColor: theme.border },
        pressed && { backgroundColor: theme.backgroundElement },
      ]}>
      <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
        {food.name}
      </Text>
      <Text style={[styles.label, { color: days < 0 ? theme.overdue : theme.textSecondary }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  name: { flex: 1, fontSize: 17 },
  label: { fontSize: 15 },
});
