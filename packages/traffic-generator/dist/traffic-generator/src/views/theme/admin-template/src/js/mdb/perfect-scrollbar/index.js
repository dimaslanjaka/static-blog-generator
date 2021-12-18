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
const CSS = __importStar(require("./lib/css"));
const DOM = __importStar(require("./lib/dom"));
const class_names_1 = __importDefault(require("./lib/class-names"));
const event_manager_1 = __importDefault(require("./lib/event-manager"));
const process_scroll_diff_1 = __importDefault(require("./process-scroll-diff"));
const update_geometry_1 = __importDefault(require("./update-geometry"));
const util_1 = require("./lib/util");
const click_rail_1 = __importDefault(require("./handlers/click-rail"));
const drag_thumb_1 = __importDefault(require("./handlers/drag-thumb"));
const keyboard_1 = __importDefault(require("./handlers/keyboard"));
const mouse_wheel_1 = __importDefault(require("./handlers/mouse-wheel"));
const touch_1 = __importDefault(require("./handlers/touch"));
const defaultSettings = () => ({
    handlers: ['click-rail', 'drag-thumb', 'keyboard', 'wheel', 'touch'],
    maxScrollbarLength: null,
    minScrollbarLength: null,
    scrollingThreshold: 1000,
    scrollXMarginOffset: 0,
    scrollYMarginOffset: 0,
    suppressScrollX: false,
    suppressScrollY: false,
    swipeEasing: true,
    useBothWheelAxes: false,
    wheelPropagation: true,
    wheelSpeed: 1,
});
const handlers = {
    'click-rail': click_rail_1.default,
    'drag-thumb': drag_thumb_1.default,
    keyboard: keyboard_1.default,
    wheel: mouse_wheel_1.default,
    touch: touch_1.default,
};
class PerfectScrollbar {
    constructor(element, userSettings = {}) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        if (!element || !element.nodeName) {
            throw new Error('no element is specified to initialize PerfectScrollbar');
        }
        this.element = element;
        element.classList.add(class_names_1.default.main);
        this.settings = defaultSettings();
        for (const key in userSettings) {
            this.settings[key] = userSettings[key];
        }
        this.containerWidth = null;
        this.containerHeight = null;
        this.contentWidth = null;
        this.contentHeight = null;
        const focus = () => element.classList.add(class_names_1.default.state.focus);
        const blur = () => element.classList.remove(class_names_1.default.state.focus);
        this.isRtl = CSS.get(element).direction === 'rtl';
        if (this.isRtl === true) {
            element.classList.add(class_names_1.default.rtl);
        }
        this.isNegativeScroll = (() => {
            const originalScrollLeft = element.scrollLeft;
            let result = null;
            element.scrollLeft = -1;
            result = element.scrollLeft < 0;
            element.scrollLeft = originalScrollLeft;
            return result;
        })();
        this.negativeScrollAdjustment = this.isNegativeScroll
            ? element.scrollWidth - element.clientWidth
            : 0;
        this.event = new event_manager_1.default();
        this.ownerDocument = element.ownerDocument || document;
        this.scrollbarXRail = DOM.div(class_names_1.default.element.rail('x'));
        element.appendChild(this.scrollbarXRail);
        this.scrollbarX = DOM.div(class_names_1.default.element.thumb('x'));
        this.scrollbarXRail.appendChild(this.scrollbarX);
        this.scrollbarX.setAttribute('tabindex', 0);
        this.event.bind(this.scrollbarX, 'focus', focus);
        this.event.bind(this.scrollbarX, 'blur', blur);
        this.scrollbarXActive = null;
        this.scrollbarXWidth = null;
        this.scrollbarXLeft = null;
        const railXStyle = CSS.get(this.scrollbarXRail);
        this.scrollbarXBottom = parseInt(railXStyle.bottom, 10);
        if (isNaN(this.scrollbarXBottom)) {
            this.isScrollbarXUsingBottom = false;
            this.scrollbarXTop = (0, util_1.toInt)(railXStyle.top);
        }
        else {
            this.isScrollbarXUsingBottom = true;
        }
        this.railBorderXWidth = (0, util_1.toInt)(railXStyle.borderLeftWidth) + (0, util_1.toInt)(railXStyle.borderRightWidth);
        // Set rail to display:block to calculate margins
        CSS.set(this.scrollbarXRail, { display: 'block' });
        this.railXMarginWidth = (0, util_1.toInt)(railXStyle.marginLeft) + (0, util_1.toInt)(railXStyle.marginRight);
        CSS.set(this.scrollbarXRail, { display: '' });
        this.railXWidth = null;
        this.railXRatio = null;
        this.scrollbarYRail = DOM.div(class_names_1.default.element.rail('y'));
        element.appendChild(this.scrollbarYRail);
        this.scrollbarY = DOM.div(class_names_1.default.element.thumb('y'));
        this.scrollbarYRail.appendChild(this.scrollbarY);
        this.scrollbarY.setAttribute('tabindex', 0);
        this.event.bind(this.scrollbarY, 'focus', focus);
        this.event.bind(this.scrollbarY, 'blur', blur);
        this.scrollbarYActive = null;
        this.scrollbarYHeight = null;
        this.scrollbarYTop = null;
        const railYStyle = CSS.get(this.scrollbarYRail);
        this.scrollbarYRight = parseInt(railYStyle.right, 10);
        if (isNaN(this.scrollbarYRight)) {
            this.isScrollbarYUsingRight = false;
            this.scrollbarYLeft = (0, util_1.toInt)(railYStyle.left);
        }
        else {
            this.isScrollbarYUsingRight = true;
        }
        this.scrollbarYOuterWidth = this.isRtl ? (0, util_1.outerWidth)(this.scrollbarY) : null;
        this.railBorderYWidth = (0, util_1.toInt)(railYStyle.borderTopWidth) + (0, util_1.toInt)(railYStyle.borderBottomWidth);
        CSS.set(this.scrollbarYRail, { display: 'block' });
        this.railYMarginHeight = (0, util_1.toInt)(railYStyle.marginTop) + (0, util_1.toInt)(railYStyle.marginBottom);
        CSS.set(this.scrollbarYRail, { display: '' });
        this.railYHeight = null;
        this.railYRatio = null;
        this.reach = {
            x: element.scrollLeft <= 0
                ? 'start'
                : element.scrollLeft >= this.contentWidth - this.containerWidth
                    ? 'end'
                    : null,
            y: element.scrollTop <= 0
                ? 'start'
                : element.scrollTop >= this.contentHeight - this.containerHeight
                    ? 'end'
                    : null,
        };
        this.isAlive = true;
        this.settings.handlers.forEach((handlerName) => handlers[handlerName](this));
        this.lastScrollTop = Math.floor(element.scrollTop); // for onScroll only
        this.lastScrollLeft = element.scrollLeft; // for onScroll only
        this.event.bind(this.element, 'scroll', (e) => this.onScroll(e));
        (0, update_geometry_1.default)(this);
    }
    update() {
        if (!this.isAlive) {
            return;
        }
        // Recalcuate negative scrollLeft adjustment
        this.negativeScrollAdjustment = this.isNegativeScroll
            ? this.element.scrollWidth - this.element.clientWidth
            : 0;
        // Recalculate rail margins
        CSS.set(this.scrollbarXRail, { display: 'block' });
        CSS.set(this.scrollbarYRail, { display: 'block' });
        this.railXMarginWidth =
            (0, util_1.toInt)(CSS.get(this.scrollbarXRail).marginLeft) +
                (0, util_1.toInt)(CSS.get(this.scrollbarXRail).marginRight);
        this.railYMarginHeight =
            (0, util_1.toInt)(CSS.get(this.scrollbarYRail).marginTop) +
                (0, util_1.toInt)(CSS.get(this.scrollbarYRail).marginBottom);
        // Hide scrollbars not to affect scrollWidth and scrollHeight
        CSS.set(this.scrollbarXRail, { display: 'none' });
        CSS.set(this.scrollbarYRail, { display: 'none' });
        (0, update_geometry_1.default)(this);
        (0, process_scroll_diff_1.default)(this, 'top', 0, false, true);
        (0, process_scroll_diff_1.default)(this, 'left', 0, false, true);
        CSS.set(this.scrollbarXRail, { display: '' });
        CSS.set(this.scrollbarYRail, { display: '' });
    }
    onScroll(e) {
        if (!this.isAlive) {
            return;
        }
        (0, update_geometry_1.default)(this);
        (0, process_scroll_diff_1.default)(this, 'top', this.element.scrollTop - this.lastScrollTop);
        (0, process_scroll_diff_1.default)(this, 'left', this.element.scrollLeft - this.lastScrollLeft);
        this.lastScrollTop = Math.floor(this.element.scrollTop);
        this.lastScrollLeft = this.element.scrollLeft;
    }
    destroy() {
        if (!this.isAlive) {
            return;
        }
        this.event.unbindAll();
        DOM.remove(this.scrollbarX);
        DOM.remove(this.scrollbarY);
        DOM.remove(this.scrollbarXRail);
        DOM.remove(this.scrollbarYRail);
        this.removePsClasses();
        // unset elements
        this.element = null;
        this.scrollbarX = null;
        this.scrollbarY = null;
        this.scrollbarXRail = null;
        this.scrollbarYRail = null;
        this.isAlive = false;
    }
    removePsClasses() {
        this.element.className = this.element.className
            .split(' ')
            .filter((name) => !name.match(/^ps([-_].+|)$/))
            .join(' ');
    }
}
exports.default = PerfectScrollbar;
//# sourceMappingURL=index.js.map