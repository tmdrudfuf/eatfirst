import { create } from 'zustand';

import * as repo from '@/repositories/foodRepository';
import type { FoodItem, FoodStatus } from '@/repositories/foodRepository';

type Snackbar = { message: string; undoId?: string; key: number };

type FoodsState = {
  foods: FoodItem[];
  loaded: boolean;
  snackbar: Snackbar | null;
  refresh: () => Promise<void>;
  addFoods: (items: { name: string; eatBy: string }[]) => Promise<void>;
  updateFood: (id: string, patch: { name: string; eatBy: string }) => Promise<void>;
  setStatus: (food: FoodItem, status: Exclude<FoodStatus, 'ACTIVE'>) => Promise<void>;
  undo: () => Promise<void>;
  showMessage: (message: string) => void;
  dismissSnackbar: () => void;
};

const STATUS_MESSAGE = {
  EATEN: 'marked as eaten',
  DISCARDED: 'marked as thrown away',
  DELETED: 'deleted',
} as const;

// Active food list shared by Eat First and Inventory. SQLite stays the source of truth;
// every mutation re-reads it.
export const useFoods = create<FoodsState>((set, get) => ({
  foods: [],
  loaded: false,
  snackbar: null,

  refresh: async () => {
    set({ foods: await repo.getActiveFoods(), loaded: true });
  },

  addFoods: async (items) => {
    await repo.addFoods(items);
    await get().refresh();
  },

  updateFood: async (id, patch) => {
    await repo.updateFood(id, patch);
    await get().refresh();
  },

  setStatus: async (food, status) => {
    await repo.setFoodStatus(food.id, status);
    set({ snackbar: { message: `${food.name} ${STATUS_MESSAGE[status]}`, undoId: food.id, key: Date.now() } });
    await get().refresh();
  },

  undo: async () => {
    const id = get().snackbar?.undoId;
    set({ snackbar: null });
    if (!id) return;
    await repo.setFoodStatus(id, 'ACTIVE');
    await get().refresh();
  },

  showMessage: (message) => set({ snackbar: { message, key: Date.now() } }),
  dismissSnackbar: () => set({ snackbar: null }),
}));
