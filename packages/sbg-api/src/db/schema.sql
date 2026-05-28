-- Post (For source/_posts markdown)
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  -- identity
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  path TEXT NOT NULL,                 -- source path (source/_posts/xxx.md)

  -- content
  content_raw TEXT NOT NULL,
  content_html TEXT,

  -- metadata (front-matter)
  excerpt TEXT,
  layout TEXT DEFAULT 'post',
  published INTEGER DEFAULT 1,        -- 0/1
  sticky INTEGER DEFAULT 0,

  -- timestamps
  created_at TEXT,
  updated_at TEXT,
  published_at TEXT,

  -- indexing helpers
  hash TEXT NOT NULL,                 -- file content hash
  lang TEXT DEFAULT 'en',

  -- optional SEO
  meta_title TEXT,
  meta_description TEXT
);

-- Pages (For source/ non _posts markdown)
CREATE TABLE IF NOT EXISTS pages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  path TEXT NOT NULL,

  content_raw TEXT NOT NULL,
  content_html TEXT,

  layout TEXT DEFAULT 'page',

  created_at TEXT,
  updated_at TEXT,

  hash TEXT NOT NULL
);

-- Tags (normalized many-to-many relationship)
CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE
);

-- Post-Tags relationship table
CREATE TABLE IF NOT EXISTS post_tags (
  post_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,

  PRIMARY KEY (post_id, tag_id),

  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Categories (normalized many-to-many relationship)
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE
);

-- Post-Categories relationship table
CREATE TABLE IF NOT EXISTS post_categories (
  post_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,

  PRIMARY KEY (post_id, category_id),

  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Build cache to track file changes and avoid unnecessary rebuilds
CREATE TABLE IF NOT EXISTS build_cache (
  file_path TEXT PRIMARY KEY,
  hash TEXT NOT NULL,
  last_built_at TEXT NOT NULL,
  type TEXT NOT NULL  -- 'post' | 'page'
);

-- Config table for storing key-value pairs (e.g., site settings)
CREATE TABLE IF NOT EXISTS config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Full-text search virtual table for posts (using FTS5) for efficient searching by title, content, and tags
CREATE VIRTUAL TABLE IF NOT EXISTS posts_fts USING fts5(
  title,
  content,
  tags,
  content='posts',
  content_rowid='id'
);

-- Sync trigger to keep FTS index in sync with posts table (Optional: Advanced)
-- Keep FTS updated:
CREATE TRIGGER IF NOT EXISTS posts_ai AFTER INSERT ON posts BEGIN
  INSERT INTO posts_fts(rowid, title, content)
  VALUES (new.id, new.title, new.content_raw);
END;
CREATE TRIGGER IF NOT EXISTS posts_ad AFTER DELETE ON posts BEGIN
  DELETE FROM posts_fts WHERE rowid = old.id;
END;
CREATE TRIGGER IF NOT EXISTS posts_au AFTER UPDATE ON posts BEGIN
  DELETE FROM posts_fts WHERE rowid = old.id;
  INSERT INTO posts_fts(rowid, title, content)
  VALUES (new.id, new.title, new.content_raw);
END;

-- Indexes for faster querying (performance-critical)
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_path ON posts(path);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_post_tags_post_id ON post_tags(post_id);
CREATE INDEX IF NOT EXISTS idx_post_tags_tag_id ON post_tags(tag_id);
