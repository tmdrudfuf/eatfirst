import { Pressable, StyleSheet, Text } from 'react-native';

import { useTheme } from '@/constants/theme';

export function Chip({ label, selected, onPress }: { label: string; selected?: boolean; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      style={[
        styles.chip,
        selected
          ? { backgroundColor: theme.tint, borderColor: theme.tint }
          : { backgroundColor: theme.backgroundElement, borderColor: theme.border },
      ]}>
      {/* Selection is shown by color only so chips never change width and reflow under the finger. */}
      <Text style={[styles.text, { color: selected ? theme.onTint : theme.text }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: 'center',
  },
  text: { fontSize: 15 },
});
