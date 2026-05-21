# API Documentation for src/symbols/unicode-symbols.ts

## fetchUnicodeData

### Parameters


### Returns

`Promise<Record<string, import("D:/Repositories/sbg-utility/packages/sbg-utility/src/symbols/unicode-symbols").UnicodeSymbol> | undefined>`

## getUnicodeSymbolByName


Retrieves the Unicode symbol corresponding to the given name.
If the name is an alias, returns the mapped symbol or alias value.
Logs a warning if the symbol is not found.


### Parameters

- `name`: `string` — - The name or alias of the Unicode symbol to retrieve.

### Returns

`string | undefined`

## getUnicodeSymbolByNameAsync


Asynchronously retrieves the Unicode symbol by name using the UnicodeData.txt database.
Caches the Unicode data after the first fetch for efficient repeated lookups.


### Parameters

- `name`: `string` — - The Unicode character name (e.g., 'GREEK CAPITAL LETTER OMEGA')

### Returns

`Promise<string | undefined>`

## getUnicodeSymbol

### Parameters

- `name`: `string`

### Returns

`Promise<string | undefined>`

