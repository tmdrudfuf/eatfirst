import type { SQLiteDatabase } from 'expo-sqlite';

import { normalizeFoodName } from '@/utils/normalizeFoodName';

import { CATALOG } from './seed';

// Append-only. Index + 1 = PRAGMA user_version after the step runs. Never edit a shipped step.
const MIGRATIONS: ((db: SQLiteDatabase) => Promise<void>)[] = [
  (db) =>
    db.execAsync(`
      CREATE TABLE food_items (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        normalized_name TEXT NOT NULL,
        added_at TEXT NOT NULL,
        eat_by TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'ACTIVE',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE INDEX idx_food_items_status_eat_by ON food_items (status, eat_by, created_at);
    `),

  async (db) => {
    await db.execAsync(`
      CREATE TABLE food_catalog (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        normalized_name TEXT NOT NULL UNIQUE,
        category TEXT
      );
    `);
    const insert = await db.prepareAsync(
      'INSERT OR IGNORE INTO food_catalog (name, normalized_name, category) VALUES (?, ?, ?)'
    );
    try {
      for (const [category, names] of Object.entries(CATALOG)) {
        for (const name of names) await insert.executeAsync(name, normalizeFoodName(name), category);
      }
    } finally {
      await insert.finalizeAsync();
    }
  },
];

export async function migrate(db: SQLiteDatabase) {
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  for (let v = row?.user_version ?? 0; v < MIGRATIONS.length; v++) {
    await db.withTransactionAsync(async () => {
      await MIGRATIONS[v](db);
      await db.execAsync(`PRAGMA user_version = ${v + 1}`);
    });
  }
}
