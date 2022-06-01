/**
 * Persistent Cache
 * @param {import('./index').Opt} options
 * @returns
 */
declare function cache(options: any): {
    put: (name: any, data: any, cb: any) => any;
    set: (name: any, data: any, cb: any) => any;
    get: (name: string | number, cb?: (e: Error) => any) => any;
    delete: (name: any, cb: any) => void;
    putSync: (name: any, data: any) => void;
    setSync: (name: any, data: any) => void;
    getSync: (name: any) => any;
    deleteSync: (name: any) => void;
    keys: (cb: any) => any;
    keysSync: () => any[];
    valuesSync: () => any[];
    unlink: (cb: any) => any;
};
export default cache;
