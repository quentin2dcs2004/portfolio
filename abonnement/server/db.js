const fs = require("fs");
const path = require("path");
const { DatabaseSync } = require("node:sqlite");

const DATA_DIR = path.join(__dirname, "..", "data");
const DB_PATH = path.join(DATA_DIR, "subscriptions.sqlite");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function openDb() {
  ensureDataDir();
  const db = new DatabaseSync(DB_PATH);
  db.exec("PRAGMA foreign_keys = ON;");
  return db;
}

function migrate(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      tagline TEXT NOT NULL DEFAULT '',
      features_json TEXT NOT NULL DEFAULT '[]',
      sort_order INTEGER NOT NULL DEFAULT 0,
      enabled INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS durations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      months INTEGER NOT NULL UNIQUE,
      label TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      enabled INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS plan_tariffs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      plan_id INTEGER NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
      duration_id INTEGER NOT NULL REFERENCES durations(id) ON DELETE CASCADE,
      total_price_cents INTEGER NOT NULL,
      currency TEXT NOT NULL DEFAULT 'EUR',
      monthly_equivalent_cents INTEGER NOT NULL,
      discount_percent REAL NOT NULL DEFAULT 0,
      auto_renew_allowed INTEGER NOT NULL DEFAULT 1,
      fixed_term_allowed INTEGER NOT NULL DEFAULT 1,
      enabled INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(plan_id, duration_id)
    );

    CREATE TABLE IF NOT EXISTS renewal_rules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      plan_id INTEGER REFERENCES plans(id) ON DELETE CASCADE,
      duration_id INTEGER REFERENCES durations(id) ON DELETE CASCADE,
      auto_renew_default INTEGER NOT NULL DEFAULT 0,
      notice_days INTEGER NOT NULL DEFAULT 7,
      terms_fr TEXT NOT NULL DEFAULT '',
      enabled INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS promotions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      promo_type TEXT NOT NULL,
      discount_percent REAL,
      discount_amount_cents INTEGER,
      plan_id INTEGER REFERENCES plans(id) ON DELETE SET NULL,
      duration_id INTEGER REFERENCES durations(id) ON DELETE SET NULL,
      min_months INTEGER,
      new_users_only INTEGER NOT NULL DEFAULT 0,
      starts_at TEXT,
      ends_at TEXT,
      max_uses INTEGER,
      used_count INTEGER NOT NULL DEFAULT 0,
      enabled INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      display_name TEXT NOT NULL DEFAULT '',
      is_new INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      plan_id INTEGER NOT NULL REFERENCES plans(id),
      duration_id INTEGER NOT NULL REFERENCES durations(id),
      tariff_id INTEGER NOT NULL REFERENCES plan_tariffs(id),
      promo_id INTEGER REFERENCES promotions(id),
      auto_renew INTEGER NOT NULL DEFAULT 0,
      start_at TEXT NOT NULL,
      end_at TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      renewal_terms_fr TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      cancelled_at TEXT,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subscription_id INTEGER NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL REFERENCES users(id),
      tx_type TEXT NOT NULL,
      amount_cents INTEGER NOT NULL,
      currency TEXT NOT NULL DEFAULT 'EUR',
      status TEXT NOT NULL DEFAULT 'succeeded',
      meta_json TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

let _db;

function getDb() {
  if (!_db) {
    _db = openDb();
    migrate(_db);
  }
  return _db;
}

function resetDb() {
  if (_db) {
    _db.close();
    _db = null;
  }
  ensureDataDir();
  if (fs.existsSync(DB_PATH)) fs.unlinkSync(DB_PATH);
  return getDb();
}

module.exports = { getDb, resetDb, DB_PATH, DATA_DIR };
