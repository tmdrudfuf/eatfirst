import { create } from 'zustand';

import { addDays, todayKey } from '@/utils/dates';
import { cleanFoodName, normalizeFoodName } from '@/utils/normalizeFoodName';

export const DEFAULT_EAT_BY_DAYS = 7;

export type SelectedFood = { key: string; name: string; eatBy: string };

type AddFoodState = {
  selected: SelectedFood[];
  toggle: (name: string) => void;
  setEatBy: (key: string, eatBy: string) => void;
  clear: () => void;
};

// Temporary selection for the unified Add flow (one or many foods).
export const useAddFood = create<AddFoodState>((set) => ({
  selected: [],

  toggle: (name) =>
    set(({ selected }) => {
      const key = normalizeFoodName(name);
      if (!key) return { selected };
      return selected.some((s) => s.key === key)
        ? { selected: selected.filter((s) => s.key !== key) }
        : { selected: [...selected, { key, name: cleanFoodName(name), eatBy: addDays(todayKey(), DEFAULT_EAT_BY_DAYS) }] };
    }),

  setEatBy: (key, eatBy) =>
    set(({ selected }) => ({ selected: selected.map((s) => (s.key === key ? { ...s, eatBy } : s)) })),

  clear: () => set({ selected: [] }),
}));
