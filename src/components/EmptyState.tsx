import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { useTheme } from '@/constants/theme';
import { useFoods } from '@/stores/foodsStore';

type Props = { title: string; body: string; action?: { label: string; onPress: () => void } };

export function EmptyState({ title, body, action }: Props) {
  const theme = useTheme();
  return (
    <View style={styles.box}>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.body, { color: theme.textSecondary }]}>{body}</Text>
      {action && (
        <View style={{ marginTop: 12, minWidth: 160 }}>
          <PrimaryButton label={action.label} onPress={action.onPress} />
        </View>
      )}
    </View>
  );
}

// Shown while the list hasn't loaded: blank (it's fast), or a retry if SQLite failed.
export function NotLoaded() {
  const theme = useTheme();
  const { loadFailed, refresh } = useFoods();
  if (!loadFailed) return <View style={{ flex: 1, backgroundColor: theme.background }} />;
  return (
    <EmptyState
      title="Couldn't load your food list"
      body="Your data is still on this device. Try again."
      action={{ label: 'Try again', onPress: () => refresh().catch(() => {}) }}
    />
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 8 },
  title: { fontSize: 20, fontWeight: '600', textAlign: 'center' },
  body: { fontSize: 15, textAlign: 'center', lineHeight: 21 },
});
