import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import schema from './schema';
import Party from './models/Party';
import Transaction from './models/Transaction';

const adapter = new SQLiteAdapter({
  schema,
  // For Android/iOS this runs on native SQLite — fully offline, no network needed.
  jsi: true,
});

export const database = new Database({
  adapter,
  modelClasses: [Party, Transaction],
});
