# API Documentation for src/utils/JSON.ts

## jsonStringifyWithCircularRefs


transform any object to json. Suppress `TypeError: Converting circular structure to JSON`

### Parameters

- `data`: `any`

### Returns

`string`

## jsonParseWithCircularRefs


parse json stringified with circular refs

### Parameters

- `data`: `string`

### Returns

`T`

