# API Documentation for src/utils/string.ts

## escapeRegex


escape regex string

### Parameters

- `string`: `string`
- `method`: `"1" | "2"`

### Returns

`string | undefined`

## capitalize


capitalize string first letter of each word which mixed with symbols

### Parameters

- `str`: `string`
- `moreSymbols`: `ConcatArray<string>` — add more symbols, default []

### Returns

`string`

## streamToString


Stream to string

### Parameters

- `stream`: `NodeJS.ReadableStream`

### Returns

`Promise<unknown>`

## bufferToString


Buffer to string

### Parameters

- `array`: `Buffer<ArrayBufferLike>`

### Returns

`string`

## slugify


slugify string

### Parameters

- `str`: `string`
- `ext`: `string | undefined`

### Returns

`string`

## isValidHttpUrl


check variable is valid http(s) url string

### Parameters

- `string`: `string | URL` — string url to validate

### Returns

`boolean`

## cleanString


Cleans a string with configurable options.


### Parameters

- `str`: `string` — - The input string to clean.
- `options`: `import("D:/Repositories/sbg-utility/packages/sbg-utility/src/utils/string").CleanStringOptions` — - Cleaning options.

### Returns

`string`

