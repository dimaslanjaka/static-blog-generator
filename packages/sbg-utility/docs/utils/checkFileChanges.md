# API Documentation for src/utils/checkFileChanges.cjs

## checkFileChanges


Check file changes using content hash cache


### Parameters

- `{ patterns, cacheFile = 'tmp/file-change-cache', callback }`: `{ patterns: string[]; cacheFile?: string | undefined; callback: (files: string[]) => any; }`

### Returns

`Promise<boolean>`

