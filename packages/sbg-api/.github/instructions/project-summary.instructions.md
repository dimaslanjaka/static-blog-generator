Yes — that design is absolutely possible, and it’s actually a very solid hybrid approach: **static site generator (SSG) + SQLite as a local content/cache layer**, similar to a “WordPress-like brain, static output body”.

You’re basically combining:

* **Hexo-like content structure**
* **WordPress-like persistence (SQLite)**
* **Static output generation**

This is not only feasible, it can be very fast and memory-friendly if designed right.

---

# 🧠 High-level architecture

Think of it as 3 layers:

### 1. Content Layer (Filesystem — Hexo style)

You already defined:

```
source/_posts/        → blog posts (front-matter markdown)
source/               → pages (non-post markdown)
themes/<theme-name>/  → theme engine (ejs/nunjucks/pug/etc)
```

This remains your **source of truth**.

---

### 2. Memory Layer (SQLite — optional cache/index)

Use SQLite as a **content index + metadata + build cache**, not as primary storage.

Example tables:

### `posts`

* id
* slug
* title
* content_raw
* content_html
* created_at
* updated_at
* tags (JSON)
* categories (JSON)
* hash (for change detection)

### `pages`

Same structure but no tags/categories.

### `build_cache`

* file_path
* hash
* last_built_at

### `tags / categories`

(optional normalized tables)

📌 This makes rebuilds fast:

* only rebuild changed files
* avoid full markdown parsing every time

---

### 3. Build Layer (Static Generator)

Output:

```
public/
  index.html
  posts/slug/index.html
  about/index.html
  assets/
```

---

# ⚙️ Rendering Engine Support

You want:

* EJS
* Nunjucks
* Pug
* Stylus / SCSS

That is also doable by using a **pluggable renderer system**:

### Template abstraction:

```js
render(template, data, engine)
```

Engine adapters:

* `ejs`
* `nunjucks`
* `pug`

Each theme declares:

```yaml
layout_engine: ejs
style: scss
```

---

# 🧩 Markdown pipeline

Use something like:

* `markdown-it` (recommended)
* plugins:

  * front-matter parser
  * syntax highlight
  * slug generator

Flow:

```
markdown file
   ↓
front-matter parse
   ↓
SQLite update (cache/index)
   ↓
Markdown → HTML
   ↓
inject into theme
   ↓
write static file
```

---

# ⚡ Why SQLite is a good idea here

Using SQLite (like a lightweight WordPress brain) gives you:

### ✔ Advantages

* fast lookup of posts/pages
* incremental builds
* search indexing (basic)
* tag/category queries without scanning filesystem
* future REST API support (optional admin panel)

### ❌ But avoid this mistake:

Don’t treat SQLite as primary CMS storage like WordPress.

Keep:

> **filesystem = source of truth**
> **SQLite = cache/index**

---

# 🔥 Incremental build strategy (important)

Instead of rebuilding everything:

1. Compute file hash
2. Compare with SQLite `build_cache`
3. Only rebuild changed files

This is how modern SSGs stay fast.

---

# 🧱 Suggested project structure

```
src/
  core/
    builder.ts
    renderer.ts
    markdown.ts
    watcher.ts

  db/
    sqlite.ts
    schema.sql

  loaders/
    posts.ts
    pages.ts

  themes/
    loader.ts

source/
  _posts/
  about.md

themes/
  default/
    layout.ejs
    post.ejs
    page.ejs
    assets/

public/
```

---

# 🧠 Optional upgrade ideas

If you want this to become “next-level Hexo alternative”:

### 1. Live preview server

* watch filesystem
* rebuild only changed routes

### 2. SQLite-powered admin panel

* optional CMS mode
* edit markdown or stored HTML

### 3. Full-text search

* SQLite FTS5 index for posts

### 4. Plugin system

like Hexo:

```js
hexo.extend.filter.register('before_generate', fn)
```

---

# ⚖️ Comparison

| Feature           | Hexo         | Your idea          |
| ----------------- | ------------ | ------------------ |
| Markdown SSG      | ✅            | ✅                  |
| Theme system      | EJS/Nunjucks | EJS/Nunjucks/Pug   |
| Incremental build | partial      | better with SQLite |
| Database          | none         | SQLite cache/index |
| Extensibility     | plugins      | plugins + DB hooks |

---

# 🧩 Conclusion

> A Hexo-like static generator powered by filesystem + SQLite indexing layer.

It gives you:

* fast builds
* scalable metadata
* optional CMS future
* minimal memory usage
* WordPress-like flexibility without server overhead

---
