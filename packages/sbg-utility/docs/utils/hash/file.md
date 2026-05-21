# API Documentation for src/utils/hash/file.ts

## md5FileSync


MD5 file synchronously

### Parameters

- `filePath`: `string | undefined`

### Returns

`string | undefined`

## md5File


MD5 file asynchronously

### Parameters

- `filePath`: `string | undefined`

### Returns

`Promise<string | undefined>`

## file_to_hash


convert file to hash

### Parameters

- `algorithm`: `HashAlgorithm`
- `filePath`: `import("fs").PathLike`
- `encoding`: `HashEncoding`

### Returns

`Promise<string>`

## folder_to_hash


Generate deterministic hashes for files inside a folder and a combined folder hash.

The function scans a directory using `glob`, hashes file metadata
(`fullPath:size:mtimeMs`) for each matched file, and then generates
a final hash from all collected file hashes.

This does **not** hash the actual file contents. It hashes file metadata
only, making it significantly faster for large directories.


### Example

```ts
```ts
const result = await folder_to_hash('sha256', './dist');

console.log(result.hash);
console.log(result.filesWithHash);
```
```

### Example

```ts
```ts
await folder_to_hash('md5', './src', {
  pattern: '**\/*.ts',
  ignored: ['**\/*.test.ts'],
  encoding: 'base64'
});
```
```

### Parameters

- `algorithm`: `HashAlgorithm` — - Hash algorithm used for file and folder hashes.
- `folder`: `string` — - Folder path to scan. Relative paths are resolved from `__dirname`.
Supports `file:` prefixed paths.
- `options`: `{ pattern?: string | undefined; ignored?: string[] | undefined; encoding?: HashEncoding | undefined; } | undefined` — - Folder hashing options.

### Returns

`Promise<{ filesWithHash: Record<string, string>; hash: string; }>`

## url_to_hash


convert URL content to hash

### Parameters

- `algorithm`: `HashAlgorithm`
- `url`: `string`
- `encoding`: `HashEncoding`

### Returns

`Promise<string>`

