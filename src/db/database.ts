import * as SQLite from 'expo-sqlite';

import { migrate } from './migrations';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

// Single shared connection, opened and migrated on first use.
export function getDb(): Promise<SQLite.SQLiteDatabase> {
  dbPromise ??= (async () => {
    const db = await SQLite.openDatabaseAsync('eatfirst.db');
    await db.execAsync('PRAGMA journal_mode = WAL;');
    await migrate(db);
    return db;
  })().catch((e) => {
    dbPromise = null;
    throw e;
  });
  return dbPromise;
}
