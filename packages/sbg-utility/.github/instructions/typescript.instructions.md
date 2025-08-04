---
applyTo: '**/*.ts'
---

# TypeScript Coding Standards

- Use `const` and `let` instead of `var`.
- Prefer explicit types for variables, function parameters, and return values.
- Use interfaces for object shapes; use types for unions/intersections.
- Always enable `strict` mode in `tsconfig.json`.
- Avoid using `any`; use unknown or proper types instead.
- Use arrow functions for anonymous functions.
- Prefer destructuring for objects and arrays.
- Use PascalCase for types and interfaces, camelCase for variables and functions.
- Document public functions and classes with JSDoc comments.
- Keep functions small and focused on a single responsibility.
- Use `jest` for testing, and follow its conventions.