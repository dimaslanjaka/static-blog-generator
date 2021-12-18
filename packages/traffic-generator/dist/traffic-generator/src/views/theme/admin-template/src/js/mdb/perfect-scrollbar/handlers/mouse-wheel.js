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
const CSS = __importStar(require("../lib/css"));
const class_names_1 = __importDefault(require("../lib/class-names"));
const update_geometry_1 = __importDefault(require("../update-geometry"));
const util_1 = require("../lib/util");
function default_1(i) {
    const element = i.element;
    let shouldPrevent = false;
    function shouldPreventDefault(deltaX, deltaY) {
        const roundedScrollTop = Math.floor(element.scrollTop);
        const isTop = element.scrollTop === 0;
        const isBottom = roundedScrollTop + element.offsetHeight === element.scrollHeight;
        const isLeft = element.scrollLeft === 0;
        const isRight = element.scrollLeft + element.offsetWidth === element.scrollWidth;
        let hitsBound;
        // pick axis with primary direction
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
            hitsBound = isTop || isBottom;
        }
        else {
            hitsBound = isLeft || isRight;
        }
        return hitsBound ? !i.settings.wheelPropagation : true;
    }
    function getDeltaFromEvent(e) {
        let deltaX = e.deltaX;
        let deltaY = -1 * e.deltaY;
        if (typeof deltaX === 'undefined' || typeof deltaY === 'undefined') {
            // OS X Safari
            deltaX = (-1 * e.wheelDeltaX) / 6;
            deltaY = e.wheelDeltaY / 6;
        }
        if (e.deltaMode && e.deltaMode === 1) {
            // Firefox in deltaMode 1: Line scrolling
            deltaX *= 10;
            deltaY *= 10;
        }
        if (deltaX !== deltaX && deltaY !== deltaY /* NaN checks */) {
            // IE in some mouse drivers
            deltaX = 0;
            deltaY = e.wheelDelta;
        }
        if (e.shiftKey) {
            // reverse axis with shift key
            return [-deltaY, -deltaX];
        }
        return [deltaX, deltaY];
    }
    function shouldBeConsumedByChild(target, deltaX, deltaY) {
        // FIXME: this is a workaround for <select> issue in FF and IE #571
        if (!util_1.env.isWebKit && element.querySelector('select:focus')) {
            return true;
        }
        if (!element.contains(target)) {
            return false;
        }
        let cursor = target;
        while (cursor && cursor !== element) {
            if (cursor.classList.contains(class_names_1.default.element.consuming)) {
                return true;
            }
            const style = CSS.get(cursor);
            // if deltaY && vertical scrollable
            if (deltaY && style.overflowY.match(/(scroll|auto)/)) {
                const maxScrollTop = cursor.scrollHeight - cursor.clientHeight;
                if (maxScrollTop > 0) {
                    if ((cursor.scrollTop > 0 && deltaY < 0) ||
                        (cursor.scrollTop < maxScrollTop && deltaY > 0)) {
                        return true;
                    }
                }
            }
            // if deltaX && horizontal scrollable
            if (deltaX && style.overflowX.match(/(scroll|auto)/)) {
                const maxScrollLeft = cursor.scrollWidth - cursor.clientWidth;
                if (maxScrollLeft > 0) {
                    if ((cursor.scrollLeft > 0 && deltaX < 0) ||
                        (cursor.scrollLeft < maxScrollLeft && deltaX > 0)) {
                        return true;
                    }
                }
            }
            cursor = cursor.parentNode;
        }
        return false;
    }
    function mousewheelHandler(e) {
        const [deltaX, deltaY] = getDeltaFromEvent(e);
        if (shouldBeConsumedByChild(e.target, deltaX, deltaY)) {
            return;
        }
        let shouldPrevent = false;
        if (!i.settings.useBothWheelAxes) {
            // deltaX will only be used for horizontal scrolling and deltaY will
            // only be used for vertical scrolling - this is the default
            element.scrollTop -= deltaY * i.settings.wheelSpeed;
            element.scrollLeft += deltaX * i.settings.wheelSpeed;
        }
        else if (i.scrollbarYActive && !i.scrollbarXActive) {
            // only vertical scrollbar is active and useBothWheelAxes option is
            // active, so let's scroll vertical bar using both mouse wheel axes
            if (deltaY) {
                element.scrollTop -= deltaY * i.settings.wheelSpeed;
            }
            else {
                element.scrollTop += deltaX * i.settings.wheelSpeed;
            }
            shouldPrevent = true;
        }
        else if (i.scrollbarXActive && !i.scrollbarYActive) {
            // useBothWheelAxes and only horizontal bar is active, so use both
            // wheel axes for horizontal bar
            if (deltaX) {
                element.scrollLeft += deltaX * i.settings.wheelSpeed;
            }
            else {
                element.scrollLeft -= deltaY * i.settings.wheelSpeed;
            }
            shouldPrevent = true;
        }
        (0, update_geometry_1.default)(i);
        shouldPrevent = shouldPrevent || shouldPreventDefault(deltaX, deltaY);
        if (shouldPrevent && !e.ctrlKey) {
            e.stopPropagation();
            e.preventDefault();
        }
    }
    if (typeof window.onwheel !== 'undefined') {
        i.event.bind(element, 'wheel', mousewheelHandler);
    }
    else if (typeof window.onmousewheel !== 'undefined') {
        i.event.bind(element, 'mousewheel', mousewheelHandler);
    }
}
exports.default = default_1;
//# sourceMappingURL=mouse-wheel.js.map