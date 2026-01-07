import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

export async function POST() {
  try {
    const url = process.env.TURSO_DATABASE_URL?.trim();
    const authToken = process.env.TURSO_AUTH_TOKEN?.trim().replace(/\s+/g, '');

    if (!url || !authToken) {
      return NextResponse.json(
        { success: false, error: 'Database credentials not configured' },
        { status: 500 }
      );
    }

    const client = createClient({ url, authToken });

    // Create tables
    const statements = [
      `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        full_name TEXT,
        company_name TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS companies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT REFERENCES users(id),
        name TEXT NOT NULL,
        industry TEXT,
        website TEXT,
        phone TEXT,
        email TEXT,
        address TEXT,
        city TEXT,
        state TEXT,
        zip TEXT,
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT REFERENCES users(id),
        company_id INTEGER REFERENCES companies(id),
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        mobile TEXT,
        job_title TEXT,
        status TEXT DEFAULT 'lead',
        source TEXT,
        address TEXT,
        city TEXT,
        state TEXT,
        zip TEXT,
        notes TEXT,
        last_contacted_at TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS deals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT REFERENCES users(id),
        contact_id INTEGER REFERENCES contacts(id),
        company_id INTEGER REFERENCES companies(id),
        title TEXT NOT NULL,
        value REAL DEFAULT 0,
        stage TEXT DEFAULT 'lead',
        probability INTEGER DEFAULT 0,
        expected_close_date TEXT,
        actual_close_date TEXT,
        description TEXT,
        lost_reason TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT REFERENCES users(id),
        contact_id INTEGER REFERENCES contacts(id),
        company_id INTEGER REFERENCES companies(id),
        deal_id INTEGER REFERENCES deals(id),
        type TEXT NOT NULL,
        subject TEXT NOT NULL,
        description TEXT,
        outcome TEXT,
        due_date TEXT,
        completed_at TEXT,
        duration INTEGER,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT REFERENCES users(id),
        contact_id INTEGER REFERENCES contacts(id),
        company_id INTEGER REFERENCES companies(id),
        deal_id INTEGER REFERENCES deals(id),
        title TEXT NOT NULL,
        description TEXT,
        priority TEXT DEFAULT 'medium',
        status TEXT DEFAULT 'pending',
        due_date TEXT,
        completed_at TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT REFERENCES users(id),
        name TEXT NOT NULL,
        color TEXT DEFAULT '#3B82F6',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS contact_tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        contact_id INTEGER REFERENCES contacts(id) NOT NULL,
        tag_id INTEGER REFERENCES tags(id) NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS pipeline_stages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT REFERENCES users(id),
        name TEXT NOT NULL,
        "order" INTEGER NOT NULL,
        color TEXT DEFAULT '#3B82F6',
        probability INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`,
    ];

    const results = [];
    for (const sql of statements) {
      try {
        await client.execute(sql);
        results.push({ sql: sql.substring(0, 50) + '...', success: true });
      } catch (err: any) {
        results.push({ sql: sql.substring(0, 50) + '...', success: false, error: err.message });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Database initialized',
      results,
    });
  } catch (error: any) {
    console.error('DB init error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST to this endpoint to initialize database tables',
  });
}
