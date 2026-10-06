import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EatByPicker } from '@/components/EatByPicker';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useTheme } from '@/constants/theme';
import { useAddFood } from '@/stores/addFoodStore';
import { useFoods } from '@/stores/foodsStore';
import { daysUntil, relativeLabel } from '@/utils/dates';

export default function EatByScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { selected, setEatBy } = useAddFood();
  const addFoods = useFoods((s) => s.addFoods);
  const showMessage = useFoods((s) => s.showMessage);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setSaving(true);
    try {
      await addFoods(selected.map((s) => ({ name: s.name, eatBy: s.eatBy })));
      router.dismissAll();
    } catch (e) {
      console.error('addFoods failed', e);
      showMessage('Could not add food. Nothing was saved — please try again.');
      setSaving(false);
    }
  };

  const n = selected.length;

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        {selected.map((s) => (
          <View key={s.key} style={[styles.card, { backgroundColor: theme.backgroundElement }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
                {s.name}
              </Text>
              <Text style={{ color: theme.textSecondary, fontSize: 15 }}>{relativeLabel(daysUntil(s.eatBy))}</Text>
            </View>
            <EatByPicker value={s.eatBy} onChange={(d) => setEatBy(s.key, d)} />
          </View>
        ))}
      </ScrollView>
      <View style={[styles.footer, { borderTopColor: theme.border, paddingBottom: 12 + insets.bottom }]}>
        <PrimaryButton
          label={n === 1 ? 'Add 1 item' : `Add ${n} items`}
          disabled={!n || saving}
          onPress={submit}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 14, padding: 14, gap: 12 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  name: { flex: 1, fontSize: 18, fontWeight: '600' },
  footer: { paddingHorizontal: 16, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth },
});
