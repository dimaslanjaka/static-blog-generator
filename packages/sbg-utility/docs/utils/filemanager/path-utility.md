# API Documentation for src/utils/filemanager/path-utility.ts

## trueCasePathSync

### Parameters

- `filePath`: `string`
- `basePath`: `string | TrueCasePathNewCallbackOpt | undefined`
- `cbOpt`: `TrueCasePathNewCallbackOpt | undefined`

### Returns

`string`

## trueCasePath

### Parameters

- `filePath`: `string`
- `basePath`: `string | TrueCasePathNewCallbackOpt | undefined`
- `cbOpt`: `TrueCasePathNewCallbackOpt | undefined`

### Returns

`Promise<string>`

## normalizePath


Normalizes a path and applies true-case-path if the file exists.

### Parameters

- `str`: `string[]` — Path segments

### Returns

`string`

## normalizePathUnix


Normalizes a path to Unix style and applies true-case-path if the file exists.

### Parameters

- `str`: `string[]` — Path segments

### Returns

`string`

## removeCwd


remove base path

### Parameters

- `target`: `string` — Path to remove from
- `toRemove`: `string` — Base path to remove

### Returns

`string`

## joinSolve


UNIX join path with auto create dirname when not exists

### Parameters

- `paths`: `string[]` — Path segments

### Returns

`string`

## replacePath


Replace path unix-style

### Parameters

- `source`: `string`
- `toReplace`: `string`
- `replacement`: `string`

### Returns

`Promise<string>`

