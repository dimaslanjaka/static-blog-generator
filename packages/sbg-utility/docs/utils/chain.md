# API Documentation for src/utils/chain.ts

## chain


Chainable function runner.


### Example

```ts
```ts
chain([
  {
    callback: () => 'stream process eg: gulp',
    opt: {
      before: () => 'run before callback called',
      after: () => 'run after callback called'
    }
  },
  {
    callback: () => 'promise process'
  },
  {
    callback: () => 'synchronous function'
  }
]);
```
```

### Parameters

- `schedule`: `{ callback: (...args: any[]) => any; opt?: { before?: ((...args: any[]) => any) | undefined; after?: ((...args: any[]) => any) | undefined; } | undefined; }[]` — - An array of function objects, each containing a callback and optional `opt` properties for before and after functions.

### Returns

`Promise<void>`

