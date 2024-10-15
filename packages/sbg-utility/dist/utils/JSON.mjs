import { toJSON, stringify, parse } from './JSON-serializer.mjs';

JSON.stringifyWithCircularRefs = toJSON;
/**
 * transform any object to json. Suppress `TypeError: Converting circular structure to JSON`
 * @param data
 * @returns
 */
function jsonStringifyWithCircularRefs(data) {
    return stringify(data);
}
/**
 * parse json stringified with circular refs
 */
function jsonParseWithCircularRefs(data) {
    return parse(data);
}

export { jsonParseWithCircularRefs, jsonStringifyWithCircularRefs };
