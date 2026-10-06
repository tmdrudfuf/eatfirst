import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/constants/theme';

export function EmptyState({ title, body }: { title: string; body: string }) {
  const theme = useTheme();
  return (
    <View style={styles.box}>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.body, { color: theme.textSecondary }]}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 8 },
  title: { fontSize: 20, fontWeight: '600', textAlign: 'center' },
  body: { fontSize: 15, textAlign: 'center', lineHeight: 21 },
});
