"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderKeys = void 0;
/**
 * sort alphabetically object by key
 * @param obj
 * @returns
 */
function orderKeys(obj) {
    var keys = Object.keys(obj).sort(function keyOrder(k1, k2) {
        if (k1 < k2)
            return -1;
        else if (k1 > k2)
            return +1;
        else
            return 0;
    });
    var after = {};
    for (var i = 0; i < keys.length; i++) {
        after[keys[i]] = obj[keys[i]];
        delete obj[keys[i]];
    }
    for (var i = 0; i < keys.length; i++) {
        obj[keys[i]] = after[keys[i]];
    }
    return obj;
}
exports.orderKeys = orderKeys;
//# sourceMappingURL=object.js.map