import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

// Only create client on server-side where env vars are available
const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

const client = url && authToken
  ? createClient({ url, authToken })
  : null;

export const db = client ? drizzle(client, { schema }) : null as any;

// Helper to ensure db is available
export function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Check TURSO_DATABASE_URL and TURSO_AUTH_TOKEN.');
  }
  return db;
}

export * from './schema';
