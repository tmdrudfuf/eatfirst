import { FlatList, View } from 'react-native';

import { AdBanner } from '@/components/AdBanner';
import { EmptyState, NotLoaded } from '@/components/EmptyState';
import { FoodRow } from '@/components/FoodRow';
import { useTheme } from '@/constants/theme';
import { useFoods } from '@/stores/foodsStore';
import { todayKey } from '@/utils/dates';

export default function InventoryScreen() {
  const theme = useTheme();
  const { foods, loaded } = useFoods();
  const today = todayKey();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {loaded ? (
        <FlatList
          data={foods}
          keyExtractor={(f) => f.id}
          renderItem={({ item }) => <FoodRow food={item} today={today} />}
          contentContainerStyle={foods.length ? undefined : { flexGrow: 1 }}
          ListEmptyComponent={<EmptyState title="Nothing in your fridge yet" body="Foods you add will show up here." />}
        />
      ) : (
        <NotLoaded />
      )}
      <AdBanner />
    </View>
  );
}
