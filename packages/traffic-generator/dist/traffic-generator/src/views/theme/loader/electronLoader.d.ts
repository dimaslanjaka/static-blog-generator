import "../../../../../hexo-seo/packages/js-prototypes/src/globals";
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
    loaders: NodeListOf<Element> | HTMLCollectionOf<Element>;
    constructor(opt?: ldloadOptions);
    /**
     * Direct trigger loader element
     * @param el Single DOM Element
     * @param activate true to activate
     * @returns
     */
    trigger: (el: Element | HTMLElement, activate: boolean) => boolean;
    /**
     * Activate single id (by id)
     * @param id id element
     * @returns
     */
    single: (id: string, activate: boolean) => boolean;
    /**
     * identify id for {@link ldloader.on} and {@link ldloader.off}
     * @param id
     * @param activate
     * @returns
     */
    private identify;
    /**
     * Trigger ALL for {@link ldloader.on} and {@link ldloader.off}
     * @param activate
     * @returns
     */
    private all;
    /**
     * Activate
     * @param id select with custom id (multiple with array strings), null = all
     */
    on(id?: string[] | string | Electron.WebviewTag): boolean | boolean[];
    /**
     * Deactivate
     * @param id select with custom id (multiple with array strings), default null = all
     * @returns
     */
    off(id?: string | string[] | Electron.WebviewTag): boolean | boolean[];
}
export { ldloader as ldLoader };
//# sourceMappingURL=electronLoader.d.ts.map