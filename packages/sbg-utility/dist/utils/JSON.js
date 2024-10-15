'use strict';

var JSONSerializer = require('./JSON-serializer.js');

JSON.stringifyWithCircularRefs = JSONSerializer.toJSON;
/**
 * transform any object to json. Suppress `TypeError: Converting circular structure to JSON`
 * @param data
 * @returns
 */
function jsonStringifyWithCircularRefs(data) {
    return JSONSerializer.stringify(data);
}
/**
 * parse json stringified with circular refs
 */
function jsonParseWithCircularRefs(data) {
    return JSONSerializer.parse(data);
}

exports.jsonParseWithCircularRefs = jsonParseWithCircularRefs;
exports.jsonStringifyWithCircularRefs = jsonStringifyWithCircularRefs;
