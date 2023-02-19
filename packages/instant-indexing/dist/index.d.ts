export = InstantIndexing;
declare class InstantIndexing {
    /**
     *
     * @param {import('./globals').Key} key
     */
    constructor(key: import('./globals').Key);
    /**
     * @type {Notifier}
     */
    notifier: Notifier;
    key: import("./globals").Key;
    /**
     * Update url from list of sitemap
     * @param {string} url Sitemap URL
     */
    scanSitemap(url: string): void;
}
