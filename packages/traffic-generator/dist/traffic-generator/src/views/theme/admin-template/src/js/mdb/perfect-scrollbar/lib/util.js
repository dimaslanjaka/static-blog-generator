"use strict";
/* eslint-disable */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = exports.outerWidth = exports.isEditable = exports.toInt = void 0;
const CSS = __importStar(require("./css"));
const DOM = __importStar(require("./dom"));
function toInt(x) {
    return parseInt(x, 10) || 0;
}
exports.toInt = toInt;
function isEditable(el) {
    return (DOM.matches(el, 'input,[contenteditable]') ||
        DOM.matches(el, 'select,[contenteditable]') ||
        DOM.matches(el, 'textarea,[contenteditable]') ||
        DOM.matches(el, 'button,[contenteditable]'));
}
exports.isEditable = isEditable;
function outerWidth(element) {
    const styles = CSS.get(element);
    return (toInt(styles.width) +
        toInt(styles.paddingLeft) +
        toInt(styles.paddingRight) +
        toInt(styles.borderLeftWidth) +
        toInt(styles.borderRightWidth));
}
exports.outerWidth = outerWidth;
exports.env = {
    isWebKit: typeof document !== 'undefined' && 'WebkitAppearance' in document.documentElement.style,
    supportsTouch: typeof window !== 'undefined' &&
        ('ontouchstart' in window ||
            ('maxTouchPoints' in window.navigator && window.navigator.maxTouchPoints > 0) ||
            (window.DocumentTouch && document instanceof window.DocumentTouch)),
    supportsIePointer: typeof navigator !== 'undefined' && navigator.msMaxTouchPoints,
    isChrome: typeof navigator !== 'undefined' && /Chrome/i.test(navigator && navigator.userAgent),
};
//# sourceMappingURL=util.js.map