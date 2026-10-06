import { Pressable, StyleSheet, Text } from 'react-native';

import { useTheme } from '@/constants/theme';

type Props = { label: string; onPress: () => void; disabled?: boolean; variant?: 'primary' | 'secondary' | 'danger' };

export function PrimaryButton({ label, onPress, disabled, variant = 'primary' }: Props) {
  const theme = useTheme();
  // Disabled uses neutral colors instead of a faded tint, which was unreadable in dark mode.
  const bg = disabled ? theme.backgroundElement : { primary: theme.tint, secondary: theme.backgroundElement, danger: theme.backgroundElement }[variant];
  const fg = disabled ? theme.textSecondary : { primary: theme.onTint, secondary: theme.text, danger: theme.danger }[variant];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [styles.button, { backgroundColor: bg, opacity: pressed ? 0.8 : 1 }]}>
      <Text style={[styles.text, { color: fg }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  text: { fontSize: 17, fontWeight: '600' },
});
