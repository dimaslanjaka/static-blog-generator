import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

export type QueryParams = Record<string, any>;
export type SQLiteDatabase = InstanceType<typeof Database>;
export const DEFAULT_DB_PATH = path.join(process.cwd(), 'data', 'database', 'db.sqlite');
export class SQLite {
  private db: SQLiteDatabase;

  constructor(dbPath: string = DEFAULT_DB_PATH) {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    this.db = new Database(dbPath);

    // Performance pragmas (important for SSG workloads)
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('synchronous = NORMAL');
    this.db.pragma('temp_store = MEMORY');
    this.db.pragma('foreign_keys = ON');
  }

  // -------------------------
  // Migration / schema init
  // -------------------------
  migrate(schemaFilePath: string) {
    const schema = fs.readFileSync(schemaFilePath, 'utf-8');
    this.db.exec(schema);
  }

  // -------------------------
  // Core query helpers
  // -------------------------
  prepare<T = any>(sql: string): T {
    return this.db.prepare(sql) as T;
  }

  get<T = any>(sql: string, params: QueryParams = {}): T | undefined {
    return this.db.prepare(sql).get(params) as T | undefined;
  }

  all<T = any>(sql: string, params: QueryParams = {}): T[] {
    return this.db.prepare(sql).all(params) as T[];
  }

  run(sql: string, params: QueryParams = {}) {
    return this.db.prepare(sql).run(params);
  }

  // -------------------------
  // Transactions
  // -------------------------
  transaction<T>(fn: () => T): T {
    const trx = this.db.transaction(fn);
    return trx();
  }

  // -------------------------
  // Upsert helper (very useful for build cache)
  // -------------------------
  upsert(sql: string, params: QueryParams = {}) {
    return this.db.prepare(sql).run(params);
  }

  // -------------------------
  // Bulk insert helper
  // -------------------------
  insertMany(sql: string, rows: QueryParams[]) {
    const stmt = this.db.prepare(sql);
    const trx = this.db.transaction((rows: QueryParams[]) => {
      for (const row of rows) {
        stmt.run(row);
      }
    });

    trx(rows);
  }

  // -------------------------
  // Utility
  // -------------------------
  close() {
    this.db.close();
  }

  // Raw access if needed (escape hatch)
  raw(): SQLiteDatabase {
    return this.db;
  }
}
