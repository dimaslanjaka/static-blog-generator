# API Documentation for src/utils/class-utils.ts

## isClass


Determines if the provided object is a class constructor.

### Parameters

- `obj`: `unknown` — The object to check.
Returns true if obj is a class constructor, false otherwise.

### Returns

`boolean`

## getClassName


Gets the class name from a class constructor or class instance.

### Parameters

- `obj`: `unknown` — The class constructor or instance.
Returns the class name, or null if it cannot be determined.

### Returns

`string | null`

## getFunctionName


Gets the function name from a function.

### Parameters

- `func`: `unknown` — The function to inspect.
Returns the function name, or null if it cannot be determined.

### Returns

`string | null`

