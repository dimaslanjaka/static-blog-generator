"use strict";
/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.0-beta2): util/index.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineJQueryPlugin = exports.isRTL = exports.onDOMContentLoaded = exports.element = exports.array = exports.reflow = exports.noop = exports.findShadowRoot = exports.isVisible = exports.typeCheckConfig = exports.emulateTransitionEnd = exports.isElement = exports.triggerTransitionEnd = exports.getTransitionDurationFromElement = exports.getElementFromSelector = exports.getSelectorFromElement = exports.getUID = exports.TRANSITION_END = exports.getjQuery = void 0;
const MAX_UID = 1000000;
const MILLISECONDS_MULTIPLIER = 1000;
const TRANSITION_END = 'transitionend';
exports.TRANSITION_END = TRANSITION_END;
// Shoutout AngusCroll (https://goo.gl/pxwQGp)
const toType = (obj) => {
    if (obj === null || obj === undefined) {
        return `${obj}`;
    }
    return {}.toString
        .call(obj)
        .match(/\s([a-z]+)/i)[1]
        .toLowerCase();
};
/**
 * --------------------------------------------------------------------------
 * Public Util Api
 * --------------------------------------------------------------------------
 */
const getUID = (prefix) => {
    do {
        prefix += Math.floor(Math.random() * MAX_UID);
    } while (document.getElementById(prefix));
    return prefix;
};
exports.getUID = getUID;
const getSelector = (element) => {
    let selector = element.getAttribute('data-mdb-target');
    if (!selector || selector === '#') {
        const hrefAttr = element.getAttribute('href');
        selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : null;
    }
    return selector;
};
const getSelectorFromElement = (element) => {
    const selector = getSelector(element);
    if (selector) {
        return document.querySelector(selector) ? selector : null;
    }
    return null;
};
exports.getSelectorFromElement = getSelectorFromElement;
const getElementFromSelector = (element) => {
    const selector = getSelector(element);
    return selector ? document.querySelector(selector) : null;
};
exports.getElementFromSelector = getElementFromSelector;
const getTransitionDurationFromElement = (element) => {
    if (!element) {
        return 0;
    }
    // Get transition-duration of the element
    let { transitionDuration, transitionDelay } = window.getComputedStyle(element);
    const floatTransitionDuration = Number.parseFloat(transitionDuration);
    const floatTransitionDelay = Number.parseFloat(transitionDelay);
    // Return 0 if element or transition duration is not found
    if (!floatTransitionDuration && !floatTransitionDelay) {
        return 0;
    }
    // If multiple durations are defined, take the first
    transitionDuration = transitionDuration.split(',')[0];
    transitionDelay = transitionDelay.split(',')[0];
    return ((Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) *
        MILLISECONDS_MULTIPLIER);
};
exports.getTransitionDurationFromElement = getTransitionDurationFromElement;
const triggerTransitionEnd = (element) => {
    element.dispatchEvent(new Event(TRANSITION_END));
};
exports.triggerTransitionEnd = triggerTransitionEnd;
const isElement = (obj) => (obj[0] || obj).nodeType;
exports.isElement = isElement;
const emulateTransitionEnd = (element, duration) => {
    let called = false;
    const durationPadding = 5;
    const emulatedDuration = duration + durationPadding;
    function listener() {
        called = true;
        element.removeEventListener(TRANSITION_END, listener);
    }
    element.addEventListener(TRANSITION_END, listener);
    setTimeout(() => {
        if (!called) {
            triggerTransitionEnd(element);
        }
    }, emulatedDuration);
};
exports.emulateTransitionEnd = emulateTransitionEnd;
const typeCheckConfig = (componentName, config, configTypes) => {
    Object.keys(configTypes).forEach((property) => {
        const expectedTypes = configTypes[property];
        const value = config[property];
        const valueType = value && isElement(value) ? 'element' : toType(value);
        if (!new RegExp(expectedTypes).test(valueType)) {
            throw new Error(`${componentName.toUpperCase()}: ` +
                `Option "${property}" provided type "${valueType}" ` +
                `but expected type "${expectedTypes}".`);
        }
    });
};
exports.typeCheckConfig = typeCheckConfig;
const isVisible = (element) => {
    if (!element) {
        return false;
    }
    if (element.style && element.parentNode && element.parentNode.style) {
        const elementStyle = getComputedStyle(element);
        const parentNodeStyle = getComputedStyle(element.parentNode);
        return (elementStyle.display !== 'none' &&
            parentNodeStyle.display !== 'none' &&
            elementStyle.visibility !== 'hidden');
    }
    return false;
};
exports.isVisible = isVisible;
const findShadowRoot = (element) => {
    if (!document.documentElement.attachShadow) {
        return null;
    }
    // Can find the shadow root otherwise it'll return the document
    if (typeof element.getRootNode === 'function') {
        const root = element.getRootNode();
        return root instanceof ShadowRoot ? root : null;
    }
    if (element instanceof ShadowRoot) {
        return element;
    }
    // when we don't find a shadow root
    if (!element.parentNode) {
        return null;
    }
    return findShadowRoot(element.parentNode);
};
exports.findShadowRoot = findShadowRoot;
const noop = () => function () { };
exports.noop = noop;
const reflow = (element) => element.offsetHeight;
exports.reflow = reflow;
const getjQuery = () => {
    const { jQuery } = window;
    if (jQuery && !document.body.hasAttribute('data-mdb-no-jquery')) {
        return jQuery;
    }
    return null;
};
exports.getjQuery = getjQuery;
const onDOMContentLoaded = (callback) => {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    }
    else {
        callback();
    }
};
exports.onDOMContentLoaded = onDOMContentLoaded;
const isRTL = document.documentElement.dir === 'rtl';
exports.isRTL = isRTL;
const array = (collection) => {
    return Array.from(collection);
};
exports.array = array;
const element = (tag) => {
    return document.createElement(tag);
};
exports.element = element;
const defineJQueryPlugin = (name, plugin) => {
    onDOMContentLoaded(() => {
        const $ = getjQuery();
        /* istanbul ignore if */
        if ($) {
            const JQUERY_NO_CONFLICT = $.fn[name];
            $.fn[name] = plugin.jQueryInterface;
            $.fn[name].Constructor = plugin;
            $.fn[name].noConflict = () => {
                $.fn[name] = JQUERY_NO_CONFLICT;
                return plugin.jQueryInterface;
            };
        }
    });
};
exports.defineJQueryPlugin = defineJQueryPlugin;
//# sourceMappingURL=index.js.map