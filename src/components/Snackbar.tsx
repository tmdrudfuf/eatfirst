import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useFoods } from '@/stores/foodsStore';

const DURATION_MS = 5000;

export function Snackbar() {
  const insets = useSafeAreaInsets();
  const { snackbar, undo, dismissSnackbar } = useFoods();

  useEffect(() => {
    if (!snackbar) return;
    const t = setTimeout(dismissSnackbar, DURATION_MS);
    return () => clearTimeout(t);
  }, [snackbar, dismissSnackbar]);

  if (!snackbar) return null;

  return (
    <View
      pointerEvents="box-none"
      accessibilityLiveRegion="polite"
      style={[styles.wrap, { bottom: insets.bottom + 72 }]}>
      <View style={styles.bar}>
        <Text style={styles.text} numberOfLines={2}>
          {snackbar.message}
        </Text>
        {snackbar.undoId && (
          <Pressable onPress={undo} accessibilityRole="button" hitSlop={8} style={styles.action}>
            <Text style={styles.actionText}>Undo</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 12, right: 12 },
  bar: {
    minHeight: 52,
    borderRadius: 10,
    backgroundColor: '#323232',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 4,
    elevation: 6,
  },
  text: { flex: 1, color: '#FFFFFF', fontSize: 15, paddingVertical: 12 },
  action: { minHeight: 44, minWidth: 64, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
  actionText: { color: '#A5D6A7', fontSize: 15, fontWeight: '700' },
});
