---
applyTo: '**/*'
---

# 🧠 3 levels of testing (IMPORTANT)

## 🥇 1. Unit tests

Test:

* markdown parser
* hasher
* dependency extractor

👉 Fast, no DB needed (or minimal DB)

---

## 🥈 2. Integration tests (MOST IMPORTANT for you)

Test:

* SQLite sync
* pipeline execution
* derived page generation
* incremental behavior

👉 Real DB + real filesystem

---

## 🥉 3. Build E2E tests

Test:

* full build output in `/public`
* HTML files exist
* routes correct

---

# 📁 Recommended test structure

```text id="test-structure"
test/
  unit/
    markdown.test.ts
    hasher.test.ts

  integration/
    builder.test.ts
    sync.test.ts
    derived.test.ts

  e2e/
    build-output.test.ts
```
