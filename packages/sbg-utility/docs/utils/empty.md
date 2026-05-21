# API Documentation for src/utils/empty.ts

## isEmpty


Checks if a value is empty.

Returns true if the value is:
- null or undefined
- an empty string
- an empty array
- an empty object


### Parameters

- `value`: `unknown` — - The value to check
- `options`: `import("/home/runner/work/static-blog-generator/static-blog-generator/packages/sbg-utility/src/utils/empty").EmptyOptions` — - Configuration options

### Returns

`boolean`

## isNotEmpty


Checks if a value is not empty.

This is the inverse of isEmpty(). Returns true if the value is not empty.


### Parameters

- `value`: `unknown` — - The value to check
- `options`: `import("/home/runner/work/static-blog-generator/static-blog-generator/packages/sbg-utility/src/utils/empty").EmptyOptions` — - Configuration options

### Returns

`boolean`

