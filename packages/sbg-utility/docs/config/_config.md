# API Documentation for src/config/_config.ts

## fetchConfig


find `_config.yml`

### Parameters

- `fileYML`: `string | undefined` — path to file `_config.yml` or working directory

### Returns

`void`

## setConfig


Config setter
* useful for jest

### Parameters

- `obj`: `Record<string, any> | import("D:/Repositories/sbg-utility/packages/sbg-utility/src/config/_config").ProjConf`

### Returns

`import("D:/Repositories/sbg-utility/packages/sbg-utility/src/config/_config").ProjConf`

## getConfig


Config getter
* useful for jest

### Parameters


### Returns

`import("D:/Repositories/sbg-utility/packages/sbg-utility/src/config/_config").ProjConf`

## deployConfig


get deployment config

### Parameters


### Returns

`{ deployDir: string; }`

