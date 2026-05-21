# API Documentation for src/utils/hash.ts

## md5


PHP MD5 Equivalent

### Parameters

- `data`: `string | undefined`
- `short`: `number | boolean` — If true, returns a shortened (8-char) version of the MD5 hash. If a number, returns that many characters.

### Returns

`string | undefined`

## data_to_hash


convert data to hash (async)

### Parameters

- `algorithm`: `"sha1" | "sha256" | "sha384" | "sha512" | "md5"`
- `data`: `string | Buffer<ArrayBufferLike>`
- `encoding`: `"base64" | "hex"`

### Returns

`Promise<string>`

## data_to_hash_sync


convert data to hash (sync)

### Parameters

- `algorithm`: `"sha1" | "sha256" | "sha384" | "sha512" | "md5"`
- `data`: `string | Buffer<ArrayBufferLike>`
- `encoding`: `"base64" | "hex"`

### Returns

`string`

