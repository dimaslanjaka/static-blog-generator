import { TaskCallback } from 'undertaker';
/**
 * get domain name without subdomain
 * @param url
 * @returns
 */
export declare const getDomainWithoutSubdomain: (url: string | URL) => string;
/**
 * filter external links
 * @param href
 * @returns
 */
export declare function filter_external_links(href: string, debug?: boolean): {
    /**
     * is internal?
     */
    internal: boolean;
    /**
     * original link or safelink
     */
    href: string;
};
export declare function staticAfter(done: TaskCallback): void;
/**
 * remove i2.wp.com i1.wp.com etc
 * @param str url string
 * @param replacement replacement string, default: https://res.cloudinary.com/practicaldev/image/fetch/
 * @returns
 */
export declare function removeWordpressCDN(str: string, replacement?: string): string;
/**
 * html fixer using queue method
 * @param sources insert once
 * @param callback callback after processed all files
 * @returns
 */
export declare const parseAfterGen: (sources?: string[], callback?: CallableFunction) => any;
/**
 * fix html content (safelink, nofollow, etc) using JSDOM
 * @param content
 * @returns
 */
export default function fixHtmlPost(content: string, debug?: boolean): string;
