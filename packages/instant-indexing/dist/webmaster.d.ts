/**
 * fetch site list from search console
 * @returns
 */
export declare function getSiteList(): Promise<import("googleapis").searchconsole_v1.Schema$SitesListResponse>;
/**
 * submit sitemap
 * @param siteUrl
 * @param feedpath
 * @returns
 */
export declare function submitSitemap(siteUrl: string, feedpath: string): Promise<void>;
/**
 * check url already indexed or not from webmaster
 * @param inspectionUrl
 * @param siteUrl
 * @returns
 */
export declare function checkIndexed(inspectionUrl: string, siteUrl: string): Promise<boolean>;
