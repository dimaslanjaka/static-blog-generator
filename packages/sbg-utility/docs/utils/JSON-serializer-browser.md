# API Documentation for src/utils/JSON-serializer-browser.ts

## jsonStringifyWithCircularRefsBrowser


transform any object to json. Suppress `TypeError: Converting circular structure to JSON`

### Parameters

- `data`: `unknown` — - The object to stringify

### Returns

`string`

## jsonParseWithCircularRefsBrowser


parse json stringified with circular refs

### Parameters

- `data`: `string` — - The JSON string to parse

### Returns

`T`

