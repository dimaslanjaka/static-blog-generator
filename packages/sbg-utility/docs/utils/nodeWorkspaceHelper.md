# API Documentation for src/utils/nodeWorkspaceHelper.ts

## findYarnRootWorkspace


search yarn root workspace folder

### Parameters

- `ctx`: `{ base_dir: string; }` — option with property `base_dir`

### Returns

`string | null`

## resolveCommand


Resolves the path of a command binary from `node_modules/.bin`.

This function searches for the specified command in various directories, including
the current working directory, the module directory, and optionally, user-defined
search directories. If the command is not found, it returns the original command name.


### Parameters

- `commandName`: `string` — - The name of the command to resolve.
- `options`: `{ searchDir: string | string[]; } | undefined` — - Optional parameters for command resolution.

### Returns

`string`

