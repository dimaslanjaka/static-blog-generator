/**
 * make all properties as optional recursively
 */
export type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;
/**
 * null | type
 */
export type Nullable<T> = T | null | undefined;
