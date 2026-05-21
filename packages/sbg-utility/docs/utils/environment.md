# API Documentation for src/utils/environment.ts

## isdev


Checks if the current NODE_ENV indicates a development environment.
Returns true if NODE_ENV contains 'dev', false otherwise.

### Parameters


### Returns

`boolean`

## get_binary_path


Gets the path to a binary command in the local node_modules/.bin directory.

### Parameters

- `commandName`: `string` — The name of the command.
Returns the path to the command binary.
- `resolveNodeAbsolutePath`: `boolean`

### Returns

`string`

