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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DOM = __importStar(require("../lib/dom"));
const update_geometry_1 = __importDefault(require("../update-geometry"));
const util_1 = require("../lib/util");
function default_1(i) {
    const element = i.element;
    const elementHovered = () => DOM.matches(element, ':hover');
    const scrollbarFocused = () => DOM.matches(i.scrollbarX, ':focus') || DOM.matches(i.scrollbarY, ':focus');
    function shouldPreventDefault(deltaX, deltaY) {
        const scrollTop = Math.floor(element.scrollTop);
        if (deltaX === 0) {
            if (!i.scrollbarYActive) {
                return false;
            }
            if ((scrollTop === 0 && deltaY > 0) ||
                (scrollTop >= i.contentHeight - i.containerHeight && deltaY < 0)) {
                return !i.settings.wheelPropagation;
            }
        }
        const scrollLeft = element.scrollLeft;
        if (deltaY === 0) {
            if (!i.scrollbarXActive) {
                return false;
            }
            if ((scrollLeft === 0 && deltaX < 0) ||
                (scrollLeft >= i.contentWidth - i.containerWidth && deltaX > 0)) {
                return !i.settings.wheelPropagation;
            }
        }
        return true;
    }
    i.event.bind(i.ownerDocument, 'keydown', (e) => {
        if ((e.isDefaultPrevented && e.isDefaultPrevented()) || e.defaultPrevented) {
            return;
        }
        if (!elementHovered() && !scrollbarFocused()) {
            return;
        }
        let activeElement = document.activeElement
            ? document.activeElement
            : i.ownerDocument.activeElement;
        if (activeElement) {
            if (activeElement.tagName === 'IFRAME') {
                activeElement = activeElement.contentDocument.activeElement;
            }
            else {
                // go deeper if element is a webcomponent
                while (activeElement.shadowRoot) {
                    activeElement = activeElement.shadowRoot.activeElement;
                }
            }
            if ((0, util_1.isEditable)(activeElement)) {
                return;
            }
        }
        let deltaX = 0;
        let deltaY = 0;
        switch (e.which) {
            case 37: // left
                if (e.metaKey) {
                    deltaX = -i.contentWidth;
                }
                else if (e.altKey) {
                    deltaX = -i.containerWidth;
                }
                else {
                    deltaX = -30;
                }
                break;
            case 38: // up
                if (e.metaKey) {
                    deltaY = i.contentHeight;
                }
                else if (e.altKey) {
                    deltaY = i.containerHeight;
                }
                else {
                    deltaY = 30;
                }
                break;
            case 39: // right
                if (e.metaKey) {
                    deltaX = i.contentWidth;
                }
                else if (e.altKey) {
                    deltaX = i.containerWidth;
                }
                else {
                    deltaX = 30;
                }
                break;
            case 40: // down
                if (e.metaKey) {
                    deltaY = -i.contentHeight;
                }
                else if (e.altKey) {
                    deltaY = -i.containerHeight;
                }
                else {
                    deltaY = -30;
                }
                break;
            case 32: // space bar
                if (e.shiftKey) {
                    deltaY = i.containerHeight;
                }
                else {
                    deltaY = -i.containerHeight;
                }
                break;
            case 33: // page up
                deltaY = i.containerHeight;
                break;
            case 34: // page down
                deltaY = -i.containerHeight;
                break;
            case 36: // home
                deltaY = i.contentHeight;
                break;
            case 35: // end
                deltaY = -i.contentHeight;
                break;
            default:
                return;
        }
        if (i.settings.suppressScrollX && deltaX !== 0) {
            return;
        }
        if (i.settings.suppressScrollY && deltaY !== 0) {
            return;
        }
        element.scrollTop -= deltaY;
        element.scrollLeft += deltaX;
        (0, update_geometry_1.default)(i);
        if (shouldPreventDefault(deltaX, deltaY)) {
            e.preventDefault();
        }
    });
}
exports.default = default_1;
//# sourceMappingURL=keyboard.js.map