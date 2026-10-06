import { randomUUID } from 'expo-crypto';

import { getDb } from '@/db/database';
import { cleanFoodName, normalizeFoodName } from '@/utils/normalizeFoodName';

export type FoodStatus = 'ACTIVE' | 'EATEN' | 'DISCARDED' | 'DELETED';

export type FoodItem = {
  id: string;
  name: string;
  normalized_name: string;
  added_at: string;
  eat_by: string; // local YYYY-MM-DD
  status: FoodStatus;
  created_at: string;
  updated_at: string;
};

export type FoodName = { name: string; normalized_name: string };

export async function getActiveFoods(): Promise<FoodItem[]> {
  const db = await getDb();
  return db.getAllAsync<FoodItem>(
    "SELECT * FROM food_items WHERE status = 'ACTIVE' ORDER BY eat_by ASC, created_at ASC"
  );
}

export async function getFood(id: string): Promise<FoodItem | null> {
  const db = await getDb();
  return db.getFirstAsync<FoodItem>('SELECT * FROM food_items WHERE id = ?', id);
}

// Recent = distinct names from past items (any status but DELETED), newest first.
export async function getRecentFoods(limit = 15): Promise<FoodName[]> {
  const db = await getDb();
  return db.getAllAsync<FoodName>(
    `SELECT name, normalized_name, MAX(created_at) AS last_added
     FROM food_items WHERE status != 'DELETED'
     GROUP BY normalized_name ORDER BY last_added DESC LIMIT ?`,
    limit
  );
}

export async function searchCatalog(query: string, limit = 30): Promise<FoodName[]> {
  const q = normalizeFoodName(query).replace(/[\\%_]/g, (c) => '\\' + c);
  if (!q) return [];
  const db = await getDb();
  return db.getAllAsync<FoodName>(
    `SELECT name, normalized_name FROM food_catalog
     WHERE normalized_name LIKE '%' || ? || '%' ESCAPE '\\'
     ORDER BY normalized_name LIKE ? || '%' ESCAPE '\\' DESC, length(name), name
     LIMIT ?`,
    q,
    q,
    limit
  );
}

// All-or-nothing: either every item is added or none is.
export async function addFoods(items: { name: string; eatBy: string }[]): Promise<void> {
  const db = await getDb();
  const now = new Date().toISOString();
  await db.withExclusiveTransactionAsync(async (txn) => {
    for (const { name, eatBy } of items) {
      await txn.runAsync(
        `INSERT INTO food_items (id, name, normalized_name, added_at, eat_by, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, 'ACTIVE', ?, ?)`,
        randomUUID(),
        cleanFoodName(name),
        normalizeFoodName(name),
        now,
        eatBy,
        now,
        now
      );
    }
  });
}

export async function updateFood(id: string, patch: { name: string; eatBy: string }): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    'UPDATE food_items SET name = ?, normalized_name = ?, eat_by = ?, updated_at = ? WHERE id = ?',
    cleanFoodName(patch.name),
    normalizeFoodName(patch.name),
    patch.eatBy,
    new Date().toISOString(),
    id
  );
}

// Covers Ate (EATEN), Thrown away (DISCARDED), Delete (DELETED) and Undo/restore (ACTIVE).
export async function setFoodStatus(id: string, status: FoodStatus): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    'UPDATE food_items SET status = ?, updated_at = ? WHERE id = ?',
    status,
    new Date().toISOString(),
    id
  );
}
