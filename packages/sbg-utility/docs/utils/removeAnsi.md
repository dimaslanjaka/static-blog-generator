# API Documentation for src/utils/removeAnsi.ts

## removeAnsi


Removes ANSI escape codes from a string.

ANSI escape codes are commonly used to add colors, styles, and cursor
movements in terminal output. This function strips them out, returning
a plain-text version of the input string.


### Example

```ts
```ts
const colored = "\u001b[31mHello\u001b[0m World";
console.log(removeAnsi(colored)); // "Hello World"
```
```

### Parameters

- `input`: `string` — - The string that may contain ANSI escape sequences.

### Returns

`string`

