"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const class_names_1 = require("./lib/class-names");
function createEvent(name) {
    if (typeof window.CustomEvent === 'function') {
        return new CustomEvent(name);
    }
    const evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(name, false, false, undefined);
    return evt;
}
function default_1(i, axis, diff, useScrollingClass = true, forceFireReachEvent = false) {
    let fields;
    if (axis === 'top') {
        fields = ['contentHeight', 'containerHeight', 'scrollTop', 'y', 'up', 'down'];
    }
    else if (axis === 'left') {
        fields = ['contentWidth', 'containerWidth', 'scrollLeft', 'x', 'left', 'right'];
    }
    else {
        throw new Error('A proper axis should be provided');
    }
    processScrollDiff(i, diff, fields, useScrollingClass, forceFireReachEvent);
}
exports.default = default_1;
function processScrollDiff(i, diff, [contentHeight, containerHeight, scrollTop, y, up, down], useScrollingClass = true, forceFireReachEvent = false) {
    const element = i.element;
    // reset reach
    i.reach[y] = null;
    // 1 for subpixel rounding
    if (element[scrollTop] < 1) {
        i.reach[y] = 'start';
    }
    // 1 for subpixel rounding
    if (element[scrollTop] > i[contentHeight] - i[containerHeight] - 1) {
        i.reach[y] = 'end';
    }
    if (diff) {
        element.dispatchEvent(createEvent(`ps-scroll-${y}`));
        if (diff < 0) {
            element.dispatchEvent(createEvent(`ps-scroll-${up}`));
        }
        else if (diff > 0) {
            element.dispatchEvent(createEvent(`ps-scroll-${down}`));
        }
        if (useScrollingClass) {
            (0, class_names_1.setScrollingClassInstantly)(i, y);
        }
    }
    if (i.reach[y] && (diff || forceFireReachEvent)) {
        element.dispatchEvent(createEvent(`ps-${y}-reach-${i.reach[y]}`));
    }
}
//# sourceMappingURL=process-scroll-diff.js.map