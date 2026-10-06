import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EatByPicker } from '@/components/EatByPicker';
import { EmptyState } from '@/components/EmptyState';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useTheme } from '@/constants/theme';
import { getFood, type FoodItem } from '@/repositories/foodRepository';
import { useFoods } from '@/stores/foodsStore';
import { daysUntil, formatDateKey, formatTimestamp, relativeLabel } from '@/utils/dates';
import { cleanFoodName } from '@/utils/normalizeFoodName';

const STATUS_LABEL = { ACTIVE: 'Active', EATEN: 'Eaten', DISCARDED: 'Thrown away', DELETED: 'Deleted' } as const;

export default function FoodDetailScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { setStatus, updateFood } = useFoods();
  const [food, setFood] = useState<FoodItem | null | undefined>(undefined);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [eatBy, setEatBy] = useState('');

  useEffect(() => {
    getFood(id).then(setFood).catch(() => setFood(null));
  }, [id]);

  if (food === undefined) return <View style={{ flex: 1, backgroundColor: theme.background }} />;
  if (food === null) return <EmptyState title="Food not found" body="It may have been removed." />;

  const resolve = async (status: 'EATEN' | 'DISCARDED' | 'DELETED') => {
    await setStatus(food, status);
    router.back();
  };

  const confirmDelete = () =>
    Alert.alert(`Delete ${food.name}?`, 'Use this for items added by mistake. Thrown-away food should use "Thrown away".', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => resolve('DELETED') },
    ]);

  const startEdit = () => {
    setName(food.name);
    setEatBy(food.eat_by);
    setEditing(true);
  };

  const saveEdit = async () => {
    await updateFood(food.id, { name, eatBy });
    setFood({ ...food, name: cleanFoodName(name), eat_by: eatBy });
    setEditing(false);
  };

  const days = daysUntil(food.eat_by);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Stack.Screen options={{ title: editing ? 'Edit' : '' }} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 20 }} keyboardShouldPersistTaps="handled">
        {editing ? (
          <>
            <Field label="Name">
              <TextInput
                value={name}
                onChangeText={setName}
                accessibilityLabel="Name"
                style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]}
              />
            </Field>
            <Field label={`Eat By · ${formatDateKey(eatBy)}`}>
              <EatByPicker value={eatBy} onChange={setEatBy} />
            </Field>
          </>
        ) : (
          <>
            <Text style={[styles.title, { color: theme.text }]}>{food.name}</Text>
            <Field label="Eat By">
              <Text style={[styles.value, { color: theme.text }]}>
                {formatDateKey(food.eat_by)}
                <Text style={{ color: days < 0 ? theme.overdue : theme.textSecondary }}> · {relativeLabel(days)}</Text>
              </Text>
            </Field>
            <Field label="Added">
              <Text style={[styles.value, { color: theme.text }]}>{formatTimestamp(food.added_at)}</Text>
            </Field>
            <Field label="Status">
              <Text style={[styles.value, { color: theme.text }]}>{STATUS_LABEL[food.status]}</Text>
            </Field>
          </>
        )}
      </ScrollView>

      <View style={[styles.actions, { borderTopColor: theme.border, paddingBottom: 12 + insets.bottom }]}>
        {editing ? (
          <>
            <PrimaryButton label="Save" disabled={!cleanFoodName(name)} onPress={saveEdit} />
            <PrimaryButton label="Cancel" variant="secondary" onPress={() => setEditing(false)} />
          </>
        ) : food.status === 'ACTIVE' ? (
          <>
            <PrimaryButton label="Ate it" onPress={() => resolve('EATEN')} />
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <PrimaryButton label="Thrown away" variant="secondary" onPress={() => resolve('DISCARDED')} />
              </View>
              <View style={{ flex: 1 }}>
                <PrimaryButton label="Edit" variant="secondary" onPress={startEdit} />
              </View>
            </View>
            <PrimaryButton label="Delete" variant="danger" onPress={confirmDelete} />
          </>
        ) : null}
      </View>
    </View>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ color: theme.textSecondary, fontSize: 14, fontWeight: '600' }}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '700' },
  value: { fontSize: 17 },
  input: { minHeight: 48, borderRadius: 12, paddingHorizontal: 14, fontSize: 17 },
  actions: { paddingHorizontal: 16, paddingTop: 12, gap: 10, borderTopWidth: StyleSheet.hairlineWidth },
  row: { flexDirection: 'row', gap: 10 },
});
