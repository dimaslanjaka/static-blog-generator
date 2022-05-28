import moment from 'moment';
import { XArray } from '../../node/array-wrapper';
import { postMap } from './parsePost';
import postChunksIterator from './postChunksIterator';
/**
 * Partializing properties
 * @see {@link https://stackoverflow.com/a/40076355/6404439}
 */
export declare type Partial<T> = {
    [P in keyof T]?: T[P];
};
/**
 * Partializing properties deeper
 * @see {@link https://stackoverflow.com/a/40076355/6404439}
 */
export declare type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends Record<string, unknown> ? DeepPartial<T[P]> : T[P];
};
/**
 * mapped type
 */
export declare type mergedPostMap = Partial<postMap> & DeepPartial<postMap['metadata']> & Record<string, unknown>;
export interface archiveMap extends mergedPostMap {
    [key: string]: any;
    /**
     * previous page items
     */
    prev?: mergedPostMap[] | null;
    /**
     * next page items
     */
    next?: mergedPostMap[] | null;
    /**
     * current page number
     */
    page_now?: number;
    /**
     * next page number
     */
    page_next?: number;
    /**
     * next page url (only visible on archive generator)
     */
    page_next_url?: string;
    /**
     * previous page url (only visible on archive generator)
     */
    page_prev_url?: string;
    /**
     * previous page number
     */
    page_prev?: number;
    /**
     * page total
     */
    total?: number;
    /**
     * all posts in this chunks
     */
    posts?: XArray<postMap>;
}
/**
 * Transform post object
 * * merge post metadata property ({@link postMap.metadata}) to root property
 * @returns
 */
export default function postMapper(post: postMap): postMap & globalThis.Partial<import("./parsePost").postMeta>;
/**
 * transform array into an mapped chunks
 * @param chunks
 * @returns
 */
export declare function postChunksMapper<T extends any[][]>(chunks: T): T;
export declare type DumperMerged = Partial<ReturnType<typeof postChunksIterator>> & Partial<mergedPostMap> & Partial<archiveMap> & Partial<mergedPostMap> & Partial<postMap> & Record<string, unknown>;
export interface DumperType extends DumperMerged {
    [key: string]: any;
    next: any;
    prev: any;
    posts: any[];
    content: string;
}
export declare function simplifyDump<T>(post: T, except?: string[] | string): T;
export declare function simplifyDump<T extends any[]>(post: T, except?: string[] | string): T;
/**
 * split posts array to chunks
 * @param arr
 * @returns
 */
export declare function post_chunks<T extends any[]>(arr?: T): {
    /** all posts */
    posts: (postMap & globalThis.Partial<import("./parsePost").postMeta>)[];
    /** all posts chunks */
    chunk: (postMap & globalThis.Partial<import("./parsePost").postMeta>)[][];
    /** all posts infinite scroll sitedata */
    sitedata: {
        title: string;
        thumbnail: string;
        url: string;
        excerpt: string;
    }[];
};
/**
 * HexoJS date formatter
 * * Playground Test {@link https://codepen.io/dimaslanjaka/pen/LYegjaV}
 */
export declare class dateMapper {
    data: moment.Moment;
    constructor(date: moment.MomentInput);
    format: (pattern: string) => string;
    year: () => string;
    toString: () => string;
}
