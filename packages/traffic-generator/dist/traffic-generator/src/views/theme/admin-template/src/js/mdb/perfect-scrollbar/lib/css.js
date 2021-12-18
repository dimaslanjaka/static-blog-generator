"use strict";
/* eslint-disable */
Object.defineProperty(exports, "__esModule", { value: true });
exports.set = exports.get = void 0;
function get(element) {
    return getComputedStyle(element);
}
exports.get = get;
function set(element, obj) {
    for (const key in obj) {
        let val = obj[key];
        if (typeof val === 'number') {
            val = `${val}px`;
        }
        element.style[key] = val;
    }
    return element;
}
exports.set = set;
//# sourceMappingURL=css.js.map