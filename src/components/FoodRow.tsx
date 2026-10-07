import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { useTheme } from '@/constants/theme';
import type { FoodItem } from '@/repositories/foodRepository';
import { ERROR_MESSAGE, useFoods } from '@/stores/foodsStore';
import { daysUntil, relativeLabel } from '@/utils/dates';

const COMMIT_RATIO = 0.35; // drag past 35% of the width, then release, to commit

export function FoodRow({ food, today }: { food: FoodItem; today: string }) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const setStatus = useFoods((s) => s.setStatus);
  const showMessage = useFoods((s) => s.showMessage);
  const x = useSharedValue(0);
  const days = daysUntil(food.eat_by, today);
  const label = relativeLabel(days);
  const threshold = width * COMMIT_RATIO;

  // Right = ate it, left = thrown away. The row leaves the list; the snackbar offers Undo.
  const resolve = (status: 'EATEN' | 'DISCARDED') =>
    setStatus(food, status).catch(() => {
      x.set(withTiming(0));
      showMessage(ERROR_MESSAGE);
    });

  const pan = Gesture.Pan()
    .activeOffsetX([-12, 12]) // horizontal intent only, so the list still scrolls vertically
    .failOffsetY([-12, 12])
    .onUpdate((e) => {
      x.set(e.translationX);
    })
    .onEnd(() => {
      const dir = x.get() > threshold ? 1 : x.get() < -threshold ? -1 : 0;
      if (!dir) {
        x.set(withTiming(0, { duration: 150 }));
        return;
      }
      x.set(withTiming(dir * width, { duration: 150 }, () => scheduleOnRN(resolve, dir === 1 ? 'EATEN' : 'DISCARDED')));
    });

  // Background fills in from neutral to green (right) or red (left) as the drag nears the commit point.
  const backStyle = useAnimatedStyle(() => {
    const v = x.get();
    return {
      backgroundColor:
        v >= 0
          ? interpolateColor(v, [0, threshold], [theme.backgroundElement, theme.tint])
          : interpolateColor(-v, [0, threshold], [theme.backgroundElement, theme.danger]),
    };
  });
  const ateStyle = useAnimatedStyle(() => ({
    opacity: x.get() > 0 ? 1 : 0,
    color: interpolateColor(x.get(), [0, threshold], [theme.textSecondary, theme.onTint]),
    transform: [{ scale: x.get() > threshold ? 1.12 : 1 }],
  }));
  const tossStyle = useAnimatedStyle(() => ({
    opacity: x.get() < 0 ? 1 : 0,
    color: interpolateColor(-x.get(), [0, threshold], [theme.textSecondary, '#FFFFFF']),
    transform: [{ scale: x.get() < -threshold ? 1.12 : 1 }],
  }));
  const rowStyle = useAnimatedStyle(() => ({ transform: [{ translateX: x.get() }] }));

  return (
    <View style={styles.clip}>
      <Animated.View
        style={[StyleSheet.absoluteFill, styles.back, backStyle]}
        importantForAccessibility="no-hide-descendants">
        <Animated.Text style={[styles.action, ateStyle]}>✓ Ate it</Animated.Text>
        <Animated.Text style={[styles.action, tossStyle]}>Thrown away ✕</Animated.Text>
      </Animated.View>
      <GestureDetector gesture={pan}>
        <Animated.View style={[{ backgroundColor: theme.background }, rowStyle]}>
          <Pressable
            onPress={() => router.push({ pathname: '/food/[id]', params: { id: food.id } })}
            accessibilityRole="button"
            accessibilityLabel={`${food.name}, ${label}`}
            accessibilityActions={[
              { name: 'ate', label: 'Ate it' },
              { name: 'toss', label: 'Thrown away' },
            ]}
            onAccessibilityAction={(e) => resolve(e.nativeEvent.actionName === 'ate' ? 'EATEN' : 'DISCARDED')}
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
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  clip: { overflow: 'hidden' },
  back: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  action: { fontSize: 16, fontWeight: '700' },
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
