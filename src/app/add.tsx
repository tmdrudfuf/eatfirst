import { router } from 'expo-router';
import { useHeaderHeight } from 'expo-router/react-navigation';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Chip } from '@/components/Chip';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useTheme } from '@/constants/theme';
import { COMMON_FOODS } from '@/db/seed';
import { getRecentFoods, searchCatalog, type FoodName } from '@/repositories/foodRepository';
import { useAddFood } from '@/stores/addFoodStore';
import { cleanFoodName, normalizeFoodName } from '@/utils/normalizeFoodName';

export default function AddFoodScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { selected, toggle, clear } = useAddFood();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FoodName[]>([]);
  const [recent, setRecent] = useState<FoodName[]>([]);

  useEffect(() => {
    getRecentFoods().then(setRecent).catch(() => {});
    return clear; // leaving the Add flow drops the selection
  }, [clear]);

  useEffect(() => {
    let stale = false;
    searchCatalog(query)
      .then((r) => !stale && setResults(r))
      .catch(() => {});
    return () => {
      stale = true;
    };
  }, [query]);

  const isSelected = (name: string) => selected.some((s) => s.key === normalizeFoodName(name));
  const pick = (name: string) => {
    toggle(name);
    setQuery('');
  };
  const q = normalizeFoodName(query);
  const showCustom = q.length > 0 && !results.some((r) => r.normalized_name === q);

  return (
    <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={headerHeight} style={{ flex: 1, backgroundColor: theme.background }}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search foods"
        placeholderTextColor={theme.textSecondary}
        autoFocus={false}
        autoCorrect={false}
        returnKeyType="done"
        onSubmitEditing={() => {
          if (!q) return;
          pick(results[0]?.normalized_name === q ? results[0].name : query);
        }}
        accessibilityLabel="Search foods"
        style={[styles.search, { color: theme.text, backgroundColor: theme.backgroundElement }]}
      />

      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 16 }}>
        {q ? (
          <>
            {showCustom && (
              <ResultRow label={`Add "${cleanFoodName(query)}"`} onPress={() => pick(query)} accent />
            )}
            {results.map((r) => (
              <ResultRow key={r.normalized_name} label={r.name} checked={isSelected(r.name)} onPress={() => pick(r.name)} />
            ))}
          </>
        ) : (
          <>
            {recent.length > 0 && (
              <Section title="Recent">
                {recent.map((r) => (
                  <Chip key={r.normalized_name} label={r.name} selected={isSelected(r.name)} onPress={() => toggle(r.name)} />
                ))}
              </Section>
            )}
            <Section title="Common">
              {COMMON_FOODS.map((name) => (
                <Chip key={name} label={name} selected={isSelected(name)} onPress={() => toggle(name)} />
              ))}
            </Section>
          </>
        )}
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: theme.border, paddingBottom: 12 + insets.bottom }]}>
        {selected.length > 0 && (
          <Text style={{ color: theme.textSecondary, fontSize: 14 }} numberOfLines={2}>
            {selected.map((s) => `${s.name} ✓`).join('   ')}
          </Text>
        )}
        <PrimaryButton
          label={selected.length ? `Continue with ${selected.length}` : 'Select food to continue'}
          disabled={!selected.length}
          onPress={() => router.push('/eat-by')}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 16, gap: 10 }}>
      <Text accessibilityRole="header" style={{ color: theme.textSecondary, fontSize: 14, fontWeight: '600' }}>
        {title}
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{children}</View>
    </View>
  );
}

function ResultRow({ label, checked, accent, onPress }: { label: string; checked?: boolean; accent?: boolean; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!checked }}
      style={({ pressed }) => [
        styles.result,
        { borderBottomColor: theme.border },
        pressed && { backgroundColor: theme.backgroundElement },
      ]}>
      <Text style={{ flex: 1, fontSize: 17, color: accent ? theme.tint : theme.text, fontWeight: accent ? '600' : '400' }}>
        {label}
      </Text>
      {checked && <Text style={{ color: theme.tint, fontSize: 17 }}>✓</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  search: { margin: 16, marginBottom: 0, minHeight: 48, borderRadius: 12, paddingHorizontal: 14, fontSize: 17 },
  result: {
    minHeight: 52,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  footer: { paddingHorizontal: 16, paddingTop: 12, gap: 10, borderTopWidth: StyleSheet.hairlineWidth },
});
