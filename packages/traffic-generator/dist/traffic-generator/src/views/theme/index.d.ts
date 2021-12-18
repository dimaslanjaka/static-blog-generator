import htmlparser from "node-html-parser";
export default class Theme {
    index: string;
    dom: ReturnType<typeof htmlparser>;
    scan: boolean;
    /**
     * Base folder
     */
    base: string;
    constructor(base: string);
    /**
     * Load index theme for reuse template
     */
    private loadThemeIndex;
    /**
     * Get resources of route path
     * @param routePath
     * @returns
     */
    getSource(routePath: string): {
        js: string;
        css: string;
        html: string;
    };
    /**
     * Generate static files by route path
     * @param routePath
     * @returns
     */
    route(routePath: string): {
        routePath: string;
        /**
         * Get route static file path
         * @param protocol with file:// protocol ?
         * @returns
         */
        getPath(protocol?: boolean): string;
        toString(): string;
    };
    toString(): string;
    static routeResolver: {
        new (routePath: string): {
            routePath: string;
            /**
             * Get route static file path
             * @param protocol with file:// protocol ?
             * @returns
             */
            getPath(protocol?: boolean): string;
            toString(): string;
        };
    };
}
//# sourceMappingURL=index.d.ts.map