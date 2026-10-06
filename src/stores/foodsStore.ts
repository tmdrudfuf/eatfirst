import { create } from 'zustand';

import * as repo from '@/repositories/foodRepository';
import type { FoodItem, FoodStatus } from '@/repositories/foodRepository';
import { rescheduleReminders } from '@/services/notificationService';

type Snackbar = { message: string; undoId?: string; key: number };

type FoodsState = {
  foods: FoodItem[];
  loaded: boolean;
  loadFailed: boolean;
  snackbar: Snackbar | null;
  refresh: () => Promise<void>;
  addFoods: (items: { name: string; eatBy: string }[]) => Promise<void>;
  updateFood: (id: string, patch: { name: string; eatBy: string }) => Promise<void>;
  setStatus: (food: FoodItem, status: Exclude<FoodStatus, 'ACTIVE'>) => Promise<void>;
  undo: () => Promise<void>;
  showMessage: (message: string) => void;
  dismissSnackbar: () => void;
};

export const ERROR_MESSAGE = 'Something went wrong. Please try again.';

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
  loadFailed: false,
  snackbar: null,

  refresh: async () => {
    let foods: FoodItem[];
    try {
      foods = await repo.getActiveFoods();
    } catch (e) {
      set({ loadFailed: true });
      throw e;
    }
    set({ foods, loaded: true, loadFailed: false });
    rescheduleReminders(foods).catch((e) => console.warn('Reminder scheduling failed', e));
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
    try {
      await repo.setFoodStatus(id, 'ACTIVE');
      await get().refresh();
    } catch {
      get().showMessage(ERROR_MESSAGE);
    }
  },

  showMessage: (message) => set({ snackbar: { message, key: Date.now() } }),
  dismissSnackbar: () => set({ snackbar: null }),
}));
