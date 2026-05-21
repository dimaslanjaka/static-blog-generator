# API Documentation for src/utils/getNodeExecutable.ts

## getNodeExecutable


Resolves the executable path for a locally installed Node.js binary
from `node_modules/.bin`.

Resolution order:
1. Current module directory
2. Current working directory (`process.cwd()`)
3. Main module root directory

If the executable cannot be found, the original command name is returned
so it can still be resolved from the system `PATH`.


### Parameters

- `commandName`: `string` — - Binary name to resolve.

### Returns

`string`

