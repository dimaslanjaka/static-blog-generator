---
applyTo: '**/*'
---

# AI Memory (Auto-Generated Architecture Summary)

This file is an AI-friendly memory snapshot of the repository.
It is automatically generated from `/src`.

DO NOT manually edit this file.

---

# 1. System Overview

This project is a **pipeline-based modular system**.

Primary flow:

```

scan → sync → transform → process → render → output

```id="mem-flow"

Data flows strictly in one direction.

---

# 2. Module Registry

Each module below is automatically extracted from the codebase.

---

## Core Modules

{{CORE_MODULES}}

---

## Pipeline Modules

{{PIPELINE_MODULES}}

---

## Services Modules

{{SERVICES_MODULES}}

---

## Utils Modules

{{UTILS_MODULES}}

---

## Models

{{MODELS_MODULES}}

---

## Config

{{CONFIG_MODULES}}

---

# 3. Pipeline Execution Map

```

{{PIPELINE_FLOW}}

```id="mem-pipeline"

Each step:
- Has defined input/output contracts
- Must be deterministic if possible
- Must not bypass other steps

---

# 4. Module Responsibilities

Each module follows strict responsibility rules:

- core/ → business logic only
- pipeline/ → orchestration only
- services/ → external integrations
- utils/ → pure functions only
- models/ → data structure definitions
- config/ → environment/runtime config

---

# 5. Dependency Rules

Allowed:

- core → models, utils
- pipeline → core, services, models, utils
- services → utils, models
- utils → (nothing external)

Forbidden:
- utils importing services
- core importing pipeline
- services importing pipeline

---

# 6. Auto-Detected File Map

{{FILE_TREE}}

---

# 7. AI Usage Notes

This file is used as:
- Copilot context memory
- Architecture grounding reference
- Module lookup index

AI MUST:
- Follow module boundaries
- Avoid guessing missing logic
- Prefer reading source over assumptions

---
