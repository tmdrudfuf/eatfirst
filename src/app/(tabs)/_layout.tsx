import { router } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import { SymbolView } from 'expo-symbols';
import { Pressable, View } from 'react-native';

import { useTheme } from '@/constants/theme';

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.tint,
        tabBarInactiveTintColor: theme.textSecondary,
        headerRight: () => (
          <Pressable
            onPress={() => router.push('/settings')}
            accessibilityRole="button"
            accessibilityLabel="Settings"
            hitSlop={8}
            style={{ padding: 12 }}>
            <SymbolView name={{ ios: 'gearshape', android: 'settings' }} tintColor={theme.text} size={24} />
          </Pressable>
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Eat First',
          tabBarAccessibilityLabel: 'Eat First',
          tabBarIcon: ({ color }) => (
            <SymbolView name={{ ios: 'list.bullet', android: 'checklist' }} tintColor={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="new"
        options={{
          title: 'Add',
          tabBarLabel: () => null,
          tabBarAccessibilityLabel: 'Add food',
          tabBarIcon: () => (
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: theme.tint,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 12,
              }}>
              <SymbolView name={{ ios: 'plus', android: 'add' }} tintColor={theme.onTint} size={28} />
            </View>
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push('/add');
          },
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          title: 'Inventory',
          tabBarAccessibilityLabel: 'Inventory',
          tabBarIcon: ({ color }) => (
            <SymbolView name={{ ios: 'refrigerator', android: 'kitchen' }} tintColor={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}
