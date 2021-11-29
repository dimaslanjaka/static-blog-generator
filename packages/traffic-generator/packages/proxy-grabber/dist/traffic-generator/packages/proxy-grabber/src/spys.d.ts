import '../../../../hexo-seo/packages/js-prototypes/src/Array';
import Promise from 'bluebird';
export declare type returnObj = {
    /**
     * IP:PORT
     */
    proxy: string;
    /**
     * Country Code
     */
    code: string;
    /**
     * Anonymity
     * * A: Anonymous
     * * H: High Anonymous / Elite Proxy
     * * N: Transparent
     */
    anonymity: string | 'A' | 'N' | 'H';
    /**
     * Can access SSL/HTTPS?
     */
    ssl: boolean;
    /**
     * Can access google?
     */
    google: boolean;
    /**
     * Has cloudflare alert?
     */
    alert: boolean;
    /**
     * Proxy Type
     */
    type: string | 'http' | 'socks4' | 'socks5';
};
/**
 * Grab Spys
 * @returns
 */
declare function spys(): Promise<returnObj[]>;
export default spys;
