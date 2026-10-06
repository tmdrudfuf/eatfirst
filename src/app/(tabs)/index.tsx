import { useMemo } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { FoodRow } from '@/components/FoodRow';
import { ReminderPrompt } from '@/components/ReminderPrompt';
import { useTheme } from '@/constants/theme';
import type { FoodItem } from '@/repositories/foodRepository';
import { useFoods } from '@/stores/foodsStore';
import { daysUntil, eatByGroup, todayKey, type EatByGroup } from '@/utils/dates';

const GROUP_TITLES: Record<EatByGroup, string> = { today: 'Today', soon: 'Coming Up', later: 'Later' };

export default function EatFirstScreen() {
  const theme = useTheme();
  const { foods, loaded } = useFoods();
  const today = todayKey();

  // Priority is never stored; groups are derived from eat_by on every render.
  const sections = useMemo(() => {
    const groups: Record<EatByGroup, FoodItem[]> = { today: [], soon: [], later: [] };
    for (const f of foods) groups[eatByGroup(daysUntil(f.eat_by, today))].push(f);
    return (Object.keys(groups) as EatByGroup[])
      .filter((g) => groups[g].length)
      .map((g) => ({ title: GROUP_TITLES[g], data: groups[g] }));
  }, [foods, today]);

  if (!loaded) return <View style={{ flex: 1, backgroundColor: theme.background }} />;

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <SectionList
        sections={sections}
        keyExtractor={(f) => f.id}
        renderItem={({ item }) => <FoodRow food={item} today={today} />}
        renderSectionHeader={({ section }) => (
          <Text
            accessibilityRole="header"
            style={[styles.header, { color: theme.textSecondary, backgroundColor: theme.background }]}>
            {section.title}
          </Text>
        )}
        ListHeaderComponent={<ReminderPrompt />}
        contentContainerStyle={sections.length ? undefined : { flexGrow: 1 }}
        ListEmptyComponent={
          <EmptyState title="Your fridge to-do list is empty" body="Tap + to add food and choose when you want to eat it." />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 14, fontWeight: '600', paddingHorizontal: 16, paddingTop: 20, paddingBottom: 6 },
});
