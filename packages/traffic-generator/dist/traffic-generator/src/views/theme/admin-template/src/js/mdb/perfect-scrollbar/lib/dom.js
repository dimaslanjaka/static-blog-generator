"use strict";
/* eslint-disable */
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryChildren = exports.remove = exports.matches = exports.div = void 0;
function div(className) {
    const div = document.createElement('div');
    div.className = className;
    return div;
}
exports.div = div;
const elMatches = typeof Element !== 'undefined' &&
    (Element.prototype.matches ||
        Element.prototype.webkitMatchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector);
function matches(element, query) {
    if (!elMatches) {
        throw new Error('No element matching method supported');
    }
    return elMatches.call(element, query);
}
exports.matches = matches;
function remove(element) {
    if (element.remove) {
        element.remove();
    }
    else {
        if (element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }
}
exports.remove = remove;
function queryChildren(element, selector) {
    return Array.prototype.filter.call(element.children, (child) => matches(child, selector));
}
exports.queryChildren = queryChildren;
//# sourceMappingURL=dom.js.map