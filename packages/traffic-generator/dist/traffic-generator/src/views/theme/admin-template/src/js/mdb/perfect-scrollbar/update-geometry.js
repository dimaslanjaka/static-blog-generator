"use strict";
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
const CSS = __importStar(require("./lib/css"));
const DOM = __importStar(require("./lib/dom"));
const class_names_1 = __importDefault(require("./lib/class-names"));
const util_1 = require("./lib/util");
/* eslint-disable no-lonely-if */
function default_1(i) {
    const element = i.element;
    const roundedScrollTop = Math.floor(element.scrollTop);
    const rect = element.getBoundingClientRect();
    i.containerWidth = Math.floor(rect.width);
    i.containerHeight = Math.floor(rect.height);
    i.contentWidth = element.scrollWidth;
    i.contentHeight = element.scrollHeight;
    if (!element.contains(i.scrollbarXRail)) {
        // clean up and append
        DOM.queryChildren(element, class_names_1.default.element.rail('x')).forEach((el) => DOM.remove(el));
        element.appendChild(i.scrollbarXRail);
    }
    if (!element.contains(i.scrollbarYRail)) {
        // clean up and append
        DOM.queryChildren(element, class_names_1.default.element.rail('y')).forEach((el) => DOM.remove(el));
        element.appendChild(i.scrollbarYRail);
    }
    if (!i.settings.suppressScrollX &&
        i.containerWidth + i.settings.scrollXMarginOffset < i.contentWidth) {
        i.scrollbarXActive = true;
        i.railXWidth = i.containerWidth - i.railXMarginWidth;
        i.railXRatio = i.containerWidth / i.railXWidth;
        i.scrollbarXWidth = getThumbSize(i, (0, util_1.toInt)((i.railXWidth * i.containerWidth) / i.contentWidth));
        i.scrollbarXLeft = (0, util_1.toInt)(((i.negativeScrollAdjustment + element.scrollLeft) * (i.railXWidth - i.scrollbarXWidth)) /
            (i.contentWidth - i.containerWidth));
    }
    else {
        i.scrollbarXActive = false;
    }
    if (!i.settings.suppressScrollY &&
        i.containerHeight + i.settings.scrollYMarginOffset < i.contentHeight) {
        i.scrollbarYActive = true;
        i.railYHeight = i.containerHeight - i.railYMarginHeight;
        i.railYRatio = i.containerHeight / i.railYHeight;
        i.scrollbarYHeight = getThumbSize(i, (0, util_1.toInt)((i.railYHeight * i.containerHeight) / i.contentHeight));
        i.scrollbarYTop = (0, util_1.toInt)((roundedScrollTop * (i.railYHeight - i.scrollbarYHeight)) /
            (i.contentHeight - i.containerHeight));
    }
    else {
        i.scrollbarYActive = false;
    }
    if (i.scrollbarXLeft >= i.railXWidth - i.scrollbarXWidth) {
        i.scrollbarXLeft = i.railXWidth - i.scrollbarXWidth;
    }
    if (i.scrollbarYTop >= i.railYHeight - i.scrollbarYHeight) {
        i.scrollbarYTop = i.railYHeight - i.scrollbarYHeight;
    }
    updateCss(element, i);
    if (i.scrollbarXActive) {
        element.classList.add(class_names_1.default.state.active('x'));
    }
    else {
        element.classList.remove(class_names_1.default.state.active('x'));
        i.scrollbarXWidth = 0;
        i.scrollbarXLeft = 0;
        element.scrollLeft = i.isRtl === true ? i.contentWidth : 0;
    }
    if (i.scrollbarYActive) {
        element.classList.add(class_names_1.default.state.active('y'));
    }
    else {
        element.classList.remove(class_names_1.default.state.active('y'));
        i.scrollbarYHeight = 0;
        i.scrollbarYTop = 0;
        element.scrollTop = 0;
    }
}
exports.default = default_1;
function getThumbSize(i, thumbSize) {
    if (i.settings.minScrollbarLength) {
        thumbSize = Math.max(thumbSize, i.settings.minScrollbarLength);
    }
    if (i.settings.maxScrollbarLength) {
        thumbSize = Math.min(thumbSize, i.settings.maxScrollbarLength);
    }
    return thumbSize;
}
function updateCss(element, i) {
    const xRailOffset = { width: i.railXWidth };
    const roundedScrollTop = Math.floor(element.scrollTop);
    if (i.isRtl) {
        xRailOffset.left =
            i.negativeScrollAdjustment + element.scrollLeft + i.containerWidth - i.contentWidth;
    }
    else {
        xRailOffset.left = element.scrollLeft;
    }
    if (i.isScrollbarXUsingBottom) {
        xRailOffset.bottom = i.scrollbarXBottom - roundedScrollTop;
    }
    else {
        xRailOffset.top = i.scrollbarXTop + roundedScrollTop;
    }
    CSS.set(i.scrollbarXRail, xRailOffset);
    const yRailOffset = { top: roundedScrollTop, height: i.railYHeight };
    if (i.isScrollbarYUsingRight) {
        if (i.isRtl) {
            yRailOffset.right =
                i.contentWidth -
                    (i.negativeScrollAdjustment + element.scrollLeft) -
                    i.scrollbarYRight -
                    i.scrollbarYOuterWidth -
                    9;
        }
        else {
            yRailOffset.right = i.scrollbarYRight - element.scrollLeft;
        }
    }
    else {
        if (i.isRtl) {
            yRailOffset.left =
                i.negativeScrollAdjustment +
                    element.scrollLeft +
                    i.containerWidth * 2 -
                    i.contentWidth -
                    i.scrollbarYLeft -
                    i.scrollbarYOuterWidth;
        }
        else {
            yRailOffset.left = i.scrollbarYLeft + element.scrollLeft;
        }
    }
    CSS.set(i.scrollbarYRail, yRailOffset);
    CSS.set(i.scrollbarX, {
        left: i.scrollbarXLeft,
        width: i.scrollbarXWidth - i.railBorderXWidth,
    });
    CSS.set(i.scrollbarY, {
        top: i.scrollbarYTop,
        height: i.scrollbarYHeight - i.railBorderYWidth,
    });
}
//# sourceMappingURL=update-geometry.js.map