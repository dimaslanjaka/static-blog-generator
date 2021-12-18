"use strict";
/* eslint-disable */
Object.defineProperty(exports, "__esModule", { value: true });
exports.setScrollingClassInstantly = exports.removeScrollingClass = exports.addScrollingClass = void 0;
const cls = {
    main: 'ps',
    rtl: 'ps__rtl',
    element: {
        thumb: (x) => `ps__thumb-${x}`,
        rail: (x) => `ps__rail-${x}`,
        consuming: 'ps__child--consume',
    },
    state: {
        focus: 'ps--focus',
        clicking: 'ps--clicking',
        active: (x) => `ps--active-${x}`,
        scrolling: (x) => `ps--scrolling-${x}`,
    },
};
exports.default = cls;
/*
 * Helper methods
 */
const scrollingClassTimeout = { x: null, y: null };
function addScrollingClass(i, x) {
    const classList = i.element.classList;
    const className = cls.state.scrolling(x);
    if (classList.contains(className)) {
        clearTimeout(scrollingClassTimeout[x]);
    }
    else {
        classList.add(className);
    }
}
exports.addScrollingClass = addScrollingClass;
function removeScrollingClass(i, x) {
    scrollingClassTimeout[x] = setTimeout(() => i.isAlive && i.element.classList.remove(cls.state.scrolling(x)), i.settings.scrollingThreshold);
}
exports.removeScrollingClass = removeScrollingClass;
function setScrollingClassInstantly(i, x) {
    addScrollingClass(i, x);
    removeScrollingClass(i, x);
}
exports.setScrollingClassInstantly = setScrollingClassInstantly;
//# sourceMappingURL=class-names.js.map