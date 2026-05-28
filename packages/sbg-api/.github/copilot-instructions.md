# GitHub Copilot Instructions

This file defines repository-wide instructions for GitHub Copilot Chat and other AI coding assistants.

These instructions describe the project architecture, coding conventions, and expected behavior when generating or modifying code.

---

## 1. Project Overview

This project is a modular system built around a **pipeline-based architecture**.

Core goals:
- Maintain clear separation of concerns
- Ensure predictable, linear data flow
- Keep modules isolated and composable
- Minimize side effects outside boundary layers

Copilot should prioritize understanding existing architecture before suggesting changes.

---

## 2. System Architecture

The system follows a **pipeline execution model**:

```

scan → sync → transform → process → render → output

```

Each stage:
- Accepts a defined input shape
- Produces a defined output shape
- Should remain independent of unrelated steps

Rules:
- Data flows in one direction only
- No step should bypass another step
- Side effects are restricted to service/boundary layers

---

## 3. Project Structure

Standard structure under `/src`:

```

src/
core/        # Core domain logic
pipeline/    # Pipeline step definitions
services/    # External systems (DB, API, filesystem)
utils/       # Pure helper functions
models/      # Data structures and types
config/      # Configuration loaders
docs/        # Project documentation

```

Rules:
- Do not mix infrastructure with business logic
- Keep utilities stateless and reusable
- Each module must have a single responsibility

---

## 4. Pipeline Conventions

Pipeline steps are the backbone of the system.

Naming convention:
- `*Step` → pipeline stage
- `*Service` → external integration
- `*Util` → pure helper functions
- `*Model` → data definitions

Each step must define:
- Input contract
- Output contract
- Side effects (if any)
- Dependencies

Copilot must:
- Respect step order
- Preserve pipeline integrity
- Avoid skipping stages

---

## 5. Documentation Rules

All documentation must be placed in:

```

/docs

```

Required documentation types:

### Architecture Docs
- System overview
- Module responsibilities
- Data flow explanation

### Feature Docs
- Feature behavior
- Input/output contracts
- Implementation notes

### Pipeline Docs
- Step execution order
- Debugging guides
- Failure cases

### ADR (Architecture Decision Records)
Location:
```

/docs/adr/

```

Format:
- Context
- Decision
- Alternatives
- Consequences

---

## 6. Coding Standards

- Prefer composition over inheritance
- Keep functions small and focused
- Avoid circular dependencies
- Avoid hidden side effects
- Use dependency injection where applicable

Copilot should prefer:
- Minimal changes over large refactors
- Existing patterns over introducing new abstractions

---

## 7. AI Behavior Rules

When generating or modifying code, Copilot MUST:

- Analyze existing structure before editing
- Follow current project conventions
- Maintain pipeline integrity
- Prefer incremental changes
- Avoid introducing unnecessary abstractions

Copilot MUST NOT:
- Perform full system rewrites without request
- Duplicate logic across modules
- Introduce unused or speculative architecture
- Bypass pipeline stages

---

## 8. Change Safety Guidelines

Before modifying code, ensure:

1. Identify affected modules
2. Trace pipeline impact
3. Check dependencies
4. Preserve input/output contracts

For new features:
- Extend existing pipeline steps when possible
- Reuse services and utilities
- Avoid creating parallel architectures

---

## 9. Testing Strategy

- Each module must be independently testable
- Pipeline steps should have unit tests
- External services must be mocked
- Outputs should be deterministic where possible

---

## 10. AI Context Priority

Copilot should treat this repository as:

1. Existing codebase is the source of truth
2. Documentation is secondary to implementation reality
3. Inconsistent patterns likely indicate intentional design
4. Clarification should be requested when behavior is unclear

---
