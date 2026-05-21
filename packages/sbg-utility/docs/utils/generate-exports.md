# API Documentation for src/utils/generate-exports.js

## generateExports


Generates the "exports" field for a package.json file based on built files in dist folders.


### Parameters

- `{
  pkgPath = path.join(process.cwd(), 'package.json'),
  exportValues = {},
  folders = []
}`: `{ pkgPath?: string | undefined; exportValues?: any; folders?: { dir: string; prefix: string; }[] | undefined; } | undefined`

### Returns

`void`

