import { XArray } from '../../node/array-wrapper';
import { archiveMap, DeepPartial, post_chunks } from './postMapper';
export interface GeneratorOpt {
    /**
     * current page number
     */
    current_page: number;
    /**
     * base permalink
     * @example tags/tagname
     */
    base: string;
    /**
     * parent chunks (all pages)
     * @see {@link post_chunks}
     */
    parentChunks: ReturnType<typeof post_chunks>['chunk'];
    /**
     * tree chunks
     * * tree contains parent and inner chunks
     */
    treeChunks: ReturnType<typeof post_chunks>;
}
/**
 * chunks iterator transform pages to partial page data
 * @param innerChunks partial pages
 * @param opt
 * @returns
 */
export default function postChunksIterator(innerChunks: ReturnType<typeof post_chunks>['chunk'][0] | Partial<XArray<archiveMap>>, opt: DeepPartial<GeneratorOpt>): {
    /** setup sitedata array as json */
    sitedata: string;
    latestUpdated: string;
    posts: (import("./parsePost").postMap & Partial<import("./parsePost").postMeta>)[] | Partial<XArray<archiveMap>>;
    total: number;
    page_now: number;
    page_prev: number;
    page_prev_url: string;
    page_current_url: string;
    page_next_url: string;
    page_next: number;
    perm_base: string;
    perm_current: string;
};
