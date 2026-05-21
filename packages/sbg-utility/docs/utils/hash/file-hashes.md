# API Documentation for src/utils/hash/file-hashes.ts

## createFileHashes


Generate file hashes for a project directory.


### Parameters

- `{
  projectDir,
  extensions = ['py', 'js', 'php', 'cjs', 'mjs'],
  excludeDirs = [],
  extraFiles = [],
  absolutePaths = false
}`: `CreateFileHashesOptions`

### Returns

`Promise<HashMap>`

## getFileTreeString


Generates a directory/file tree string from a hash map.


### Parameters

- `hashMap`: `HashMap` — - Object mapping relative file paths to hashes.

### Returns

`string`

