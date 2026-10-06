import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { View } from 'react-native';

import { Chip } from '@/components/Chip';
import { addDays, formatDateKey, parseDateKey, toDateKey, todayKey } from '@/utils/dates';

const QUICK_DAYS = [3, 5, 7, 14];

// Quick picks store a real date (today + N), never the N itself.
export function EatByPicker({ value, onChange }: { value: string; onChange: (eatBy: string) => void }) {
  const today = todayKey();
  const quick = QUICK_DAYS.find((n) => addDays(today, n) === value);

  const openCalendar = () =>
    DateTimePickerAndroid.open({
      value: parseDateKey(value),
      mode: 'date',
      minimumDate: parseDateKey(today),
      onValueChange: (_event, date) => onChange(toDateKey(date)),
    });

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {QUICK_DAYS.map((n) => (
        <Chip key={n} label={`${n} days`} selected={quick === n} onPress={() => onChange(addDays(today, n))} />
      ))}
      <Chip label={quick ? 'Custom' : formatDateKey(value)} selected={!quick} onPress={openCalendar} />
    </View>
  );
}
