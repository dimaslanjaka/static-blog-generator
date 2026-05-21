# API Documentation for src/utils/uuid.ts

## uuidv4


Persistent UUID V4 Generator based on inputted string

### Example

```ts
for (let index = 0; index < 5; index++) console.log(uuidv4()); // <- will printted same id
```

### Parameters

- `fromString`: `string | undefined` — generate based on string (unique based on this string)

### Returns

`string`

