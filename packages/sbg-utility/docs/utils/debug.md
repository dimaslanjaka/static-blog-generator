# API Documentation for src/utils/debug.ts

## debug


Creates a debug logger with the specified name.


### Parameters

- `name`: `string` — - The name of the debug logger. This will be used as a prefix for log messages.

### Returns

`debug.Debugger`

## sbgDebug


Creates a debug logger with the default name `sbg`.

This function allows for an optional subname to further specify the debug logger.


### Parameters

- `subname`: `string | undefined` — - An optional suffix to append to the default logger name.

### Returns

`debug.Debugger`

