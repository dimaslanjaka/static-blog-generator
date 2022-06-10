import urlParse from 'url-parse';
import { DeepPartial } from '../parser/post/postMapper';
/** URL Parsed Result */
export interface URLParsed extends DeepPartial<ReturnType<typeof urlParse>> {
    /** hostname/domain/ip:port */
    host: string;
    /** hostname/domain/ip */
    hostname: string;
    /** query string */
    search: string;
    /** query string object parsed */
    searchObject: Record<string, any>;
    /** protocol://host */
    protohost: string;
    /** filename from url */
    filename: string;
}
/**
 * Automatically parse url with the query strings to object (nullable)
 * @param src url string
 * @returns object parsed {@link URLParsed} combined with partial properties from {@link urlParse}
 */
export default class urlParser {
    result: ReturnType<urlParser['parse']>;
    resultStr: string;
    constructor(src: string);
    parse(src: string): URLParsed;
    toString(): string;
}
