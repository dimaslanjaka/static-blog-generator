export interface ldloadOptions {
    /**
     * Handle on root element ({@see {@link Parameters<ParentNode.querySelector>[0]}} pattern), using `document`
     */
    root: string;
}
/**
 * Loading.io initializer
 */
export default class ldloader {
    loaders: NodeListOf<Element>;
    constructor(opt?: ldloadOptions);
    /**
     * Direct trigger loader element
     * @param el Single DOM Element
     * @param activate true to activate
     * @returns
     */
    trigger: (el: Element | HTMLElement, activate: boolean) => boolean;
    /**
     * Activate single id
     * @param id id element
     * @returns
     */
    single: (id: string, activate: boolean) => boolean;
    /**
     * Activate
     * @param id select with custom id (multiple with array strings), null = all
     */
    on(id?: string[] | string): boolean | boolean[];
    /**
     * Deactivate
     * @param id select with custom id (multiple with array strings), null = all
     * @returns
     */
    off(id: string | string[]): boolean | boolean[];
}
export { ldloader as ldLoader };
//# sourceMappingURL=electron.d.ts.map