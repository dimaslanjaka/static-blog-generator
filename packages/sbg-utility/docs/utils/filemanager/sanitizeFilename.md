# API Documentation for src/utils/filemanager/sanitizeFilename.ts

## sanitizeFilename


Sanitizes a filename for safe cross-platform filesystem usage.

Features:
- Removes invalid filename characters
- Prevents reserved Windows device names
- Collapses repeated replacement characters
- Trims trailing dots/spaces
- Preserves file extension when possible
- Enforces maximum filename length
- Allows final modification via callback


### Parameters

- `input`: `unknown` — - Original filename or path-like string to sanitize.
- `options`: `{ replacement?: string | undefined; maxLength?: number | undefined; callback?: ((result: string) => string | void) | undefined; } | undefined` — - Optional sanitization configuration.

### Returns

`string`

