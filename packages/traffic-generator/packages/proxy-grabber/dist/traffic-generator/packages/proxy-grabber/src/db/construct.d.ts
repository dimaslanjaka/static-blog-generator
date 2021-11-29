import '../../../../../hexo-seo/packages/js-prototypes/src/Number';
declare class DBConstructor {
    folder: string;
    debug: boolean;
    /**
     * Database File Constructor
     * @param folder folder to save entire databases
     */
    constructor(folder: string);
    /**
     * check if data key on table exists
     * @param key
     * @returns
     */
    exists(key: string): boolean;
    /**
     * add data to table
     * @param key
     * @param value
     */
    push(key: string, value: any): void;
    private save;
    edit(key: string, newValue: any, by: object): void;
    /**
     * get table database by key
     * @param key key table
     * @param fallback fallback value if not exists
     * @returns
     * @example
     * const nonExists = db.exists('/data-not-exists', 'default value');
     * console.log(nonExists); // default value
     */
    get<T>(key: string, fallback?: T): null | T | string | ReturnType<typeof JSON.parse> | ReturnType<typeof parseInt> | ReturnType<typeof parseFloat>;
    private locationfile;
}
export = DBConstructor;
