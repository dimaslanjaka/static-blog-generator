export = Notifier;
declare class Notifier {
    constructor(key: any);
    /**
     * @type {import('googleapis').Auth.JWT}
     */
    jwtClient: import('googleapis').Auth.JWT;
    /**
     * Single notify
     * @param {string} url
     * @param {"create"|"update"|"delete"} type
     */
    single(url: string, type: "create" | "update" | "delete"): void;
    /**
     * Batch notify
     * @param {string[]} list
     */
    batch(list: string[]): void;
}
