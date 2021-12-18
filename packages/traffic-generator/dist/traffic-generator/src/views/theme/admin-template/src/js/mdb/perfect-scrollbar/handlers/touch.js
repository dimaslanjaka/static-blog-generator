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
/* eslint-disable */
const update_geometry_1 = __importDefault(require("../update-geometry"));
const class_names_1 = __importDefault(require("../lib/class-names"));
const CSS = __importStar(require("../lib/css"));
const util_1 = require("../lib/util");
function default_1(i) {
    if (!util_1.env.supportsTouch && !util_1.env.supportsIePointer) {
        return;
    }
    const element = i.element;
    function shouldPrevent(deltaX, deltaY) {
        const scrollTop = Math.floor(element.scrollTop);
        const scrollLeft = element.scrollLeft;
        const magnitudeX = Math.abs(deltaX);
        const magnitudeY = Math.abs(deltaY);
        if (magnitudeY > magnitudeX) {
            // user is perhaps trying to swipe up/down the page
            if ((deltaY < 0 && scrollTop === i.contentHeight - i.containerHeight) ||
                (deltaY > 0 && scrollTop === 0)) {
                // set prevent for mobile Chrome refresh
                return window.scrollY === 0 && deltaY > 0 && util_1.env.isChrome;
            }
        }
        else if (magnitudeX > magnitudeY) {
            // user is perhaps trying to swipe left/right across the page
            if ((deltaX < 0 && scrollLeft === i.contentWidth - i.containerWidth) ||
                (deltaX > 0 && scrollLeft === 0)) {
                return true;
            }
        }
        return true;
    }
    function applyTouchMove(differenceX, differenceY) {
        element.scrollTop -= differenceY;
        element.scrollLeft -= differenceX;
        (0, update_geometry_1.default)(i);
    }
    let startOffset = {};
    let startTime = 0;
    let speed = {};
    let easingLoop = null;
    function getTouch(e) {
        if (e.targetTouches) {
            return e.targetTouches[0];
        }
        else {
            // Maybe IE pointer
            return e;
        }
    }
    function shouldHandle(e) {
        if (e.pointerType && e.pointerType === 'pen' && e.buttons === 0) {
            return false;
        }
        if (e.targetTouches && e.targetTouches.length === 1) {
            return true;
        }
        if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== e.MSPOINTER_TYPE_MOUSE) {
            return true;
        }
        return false;
    }
    function touchStart(e) {
        if (!shouldHandle(e)) {
            return;
        }
        const touch = getTouch(e);
        startOffset.pageX = touch.pageX;
        startOffset.pageY = touch.pageY;
        startTime = new Date().getTime();
        if (easingLoop !== null) {
            clearInterval(easingLoop);
        }
    }
    function shouldBeConsumedByChild(target, deltaX, deltaY) {
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
    function touchMove(e) {
        if (shouldHandle(e)) {
            const touch = getTouch(e);
            const currentOffset = { pageX: touch.pageX, pageY: touch.pageY };
            const differenceX = currentOffset.pageX - startOffset.pageX;
            const differenceY = currentOffset.pageY - startOffset.pageY;
            if (shouldBeConsumedByChild(e.target, differenceX, differenceY)) {
                return;
            }
            applyTouchMove(differenceX, differenceY);
            startOffset = currentOffset;
            const currentTime = new Date().getTime();
            const timeGap = currentTime - startTime;
            if (timeGap > 0) {
                speed.x = differenceX / timeGap;
                speed.y = differenceY / timeGap;
                startTime = currentTime;
            }
            if (shouldPrevent(differenceX, differenceY)) {
                e.preventDefault();
            }
        }
    }
    function touchEnd() {
        if (i.settings.swipeEasing) {
            clearInterval(easingLoop);
            easingLoop = setInterval(function () {
                if (i.isInitialized) {
                    clearInterval(easingLoop);
                    return;
                }
                if (!speed.x && !speed.y) {
                    clearInterval(easingLoop);
                    return;
                }
                if (Math.abs(speed.x) < 0.01 && Math.abs(speed.y) < 0.01) {
                    clearInterval(easingLoop);
                    return;
                }
                applyTouchMove(speed.x * 30, speed.y * 30);
                speed.x *= 0.8;
                speed.y *= 0.8;
            }, 10);
        }
    }
    if (util_1.env.supportsTouch) {
        i.event.bind(element, 'touchstart', touchStart);
        i.event.bind(element, 'touchmove', touchMove);
        i.event.bind(element, 'touchend', touchEnd);
    }
    else if (util_1.env.supportsIePointer) {
        if (window.PointerEvent) {
            i.event.bind(element, 'pointerdown', touchStart);
            i.event.bind(element, 'pointermove', touchMove);
            i.event.bind(element, 'pointerup', touchEnd);
        }
        else if (window.MSPointerEvent) {
            i.event.bind(element, 'MSPointerDown', touchStart);
            i.event.bind(element, 'MSPointerMove', touchMove);
            i.event.bind(element, 'MSPointerUp', touchEnd);
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=touch.js.map