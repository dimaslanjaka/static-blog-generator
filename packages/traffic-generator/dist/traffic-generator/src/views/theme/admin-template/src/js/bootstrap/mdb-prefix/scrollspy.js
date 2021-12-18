"use strict";
/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.0-beta2): scrollspy.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./util/index");
const data_1 = __importDefault(require("./dom/data"));
const event_handler_1 = __importDefault(require("./dom/event-handler"));
const manipulator_1 = __importDefault(require("./dom/manipulator"));
const selector_engine_1 = __importDefault(require("./dom/selector-engine"));
const base_component_1 = __importDefault(require("./base-component"));
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */
const NAME = 'scrollspy';
const DATA_KEY = 'bs.scrollspy';
const EVENT_KEY = `.${DATA_KEY}`;
const DATA_API_KEY = '.data-api';
const Default = {
    offset: 10,
    method: 'auto',
    target: '',
};
const DefaultType = {
    offset: 'number',
    method: 'string',
    target: '(string|element)',
};
const EVENT_ACTIVATE = `activate${EVENT_KEY}`;
const EVENT_SCROLL = `scroll${EVENT_KEY}`;
const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`;
const CLASS_NAME_DROPDOWN_ITEM = 'dropdown-item';
const CLASS_NAME_ACTIVE = 'active';
const SELECTOR_DATA_SPY = '[data-mdb-spy="scroll"]';
const SELECTOR_NAV_LIST_GROUP = '.nav, .list-group';
const SELECTOR_NAV_LINKS = '.nav-link';
const SELECTOR_NAV_ITEMS = '.nav-item';
const SELECTOR_LIST_ITEMS = '.list-group-item';
const SELECTOR_DROPDOWN = '.dropdown';
const SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle';
const METHOD_OFFSET = 'offset';
const METHOD_POSITION = 'position';
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */
class ScrollSpy extends base_component_1.default {
    constructor(element, config) {
        super(element);
        this._scrollElement = element.tagName === 'BODY' ? window : element;
        this._config = this._getConfig(config);
        this._selector = `${this._config.target} ${SELECTOR_NAV_LINKS}, ${this._config.target} ${SELECTOR_LIST_ITEMS}, ${this._config.target} .${CLASS_NAME_DROPDOWN_ITEM}`;
        this._offsets = [];
        this._targets = [];
        this._activeTarget = null;
        this._scrollHeight = 0;
        event_handler_1.default.on(this._scrollElement, EVENT_SCROLL, () => this._process());
        this.refresh();
        this._process();
    }
    // Getters
    static get Default() {
        return Default;
    }
    static get DATA_KEY() {
        return DATA_KEY;
    }
    // Public
    refresh() {
        const autoMethod = this._scrollElement === this._scrollElement.window ? METHOD_OFFSET : METHOD_POSITION;
        const offsetMethod = this._config.method === 'auto' ? autoMethod : this._config.method;
        const offsetBase = offsetMethod === METHOD_POSITION ? this._getScrollTop() : 0;
        this._offsets = [];
        this._targets = [];
        this._scrollHeight = this._getScrollHeight();
        const targets = selector_engine_1.default.find(this._selector);
        targets
            .map((element) => {
            const targetSelector = (0, index_1.getSelectorFromElement)(element);
            const target = targetSelector ? selector_engine_1.default.findOne(targetSelector) : null;
            if (target) {
                const targetBCR = target.getBoundingClientRect();
                if (targetBCR.width || targetBCR.height) {
                    return [manipulator_1.default[offsetMethod](target).top + offsetBase, targetSelector];
                }
            }
            return null;
        })
            .filter((item) => item)
            .sort((a, b) => a[0] - b[0])
            .forEach((item) => {
            this._offsets.push(item[0]);
            this._targets.push(item[1]);
        });
    }
    dispose() {
        super.dispose();
        event_handler_1.default.off(this._scrollElement, EVENT_KEY);
        this._scrollElement = null;
        this._config = null;
        this._selector = null;
        this._offsets = null;
        this._targets = null;
        this._activeTarget = null;
        this._scrollHeight = null;
    }
    // Private
    _getConfig(config) {
        config = {
            ...Default,
            ...(typeof config === 'object' && config ? config : {}),
        };
        if (typeof config.target !== 'string' && (0, index_1.isElement)(config.target)) {
            let { id } = config.target;
            if (!id) {
                id = (0, index_1.getUID)(NAME);
                config.target.id = id;
            }
            config.target = `#${id}`;
        }
        (0, index_1.typeCheckConfig)(NAME, config, DefaultType);
        return config;
    }
    _getScrollTop() {
        return this._scrollElement === window
            ? this._scrollElement.pageYOffset
            : this._scrollElement.scrollTop;
    }
    _getScrollHeight() {
        return (this._scrollElement.scrollHeight ||
            Math.max(document.body.scrollHeight, document.documentElement.scrollHeight));
    }
    _getOffsetHeight() {
        return this._scrollElement === window
            ? window.innerHeight
            : this._scrollElement.getBoundingClientRect().height;
    }
    _process() {
        const scrollTop = this._getScrollTop() + this._config.offset;
        const scrollHeight = this._getScrollHeight();
        const maxScroll = this._config.offset + scrollHeight - this._getOffsetHeight();
        if (this._scrollHeight !== scrollHeight) {
            this.refresh();
        }
        if (scrollTop >= maxScroll) {
            const target = this._targets[this._targets.length - 1];
            if (this._activeTarget !== target) {
                this._activate(target);
            }
            return;
        }
        if (this._activeTarget && scrollTop < this._offsets[0] && this._offsets[0] > 0) {
            this._activeTarget = null;
            this._clear();
            return;
        }
        for (let i = this._offsets.length; i--;) {
            const isActiveTarget = this._activeTarget !== this._targets[i] &&
                scrollTop >= this._offsets[i] &&
                (typeof this._offsets[i + 1] === 'undefined' || scrollTop < this._offsets[i + 1]);
            if (isActiveTarget) {
                this._activate(this._targets[i]);
            }
        }
    }
    _activate(target) {
        this._activeTarget = target;
        this._clear();
        const queries = this._selector
            .split(',')
            .map((selector) => `${selector}[data-mdb-target="${target}"],${selector}[href="${target}"]`);
        const link = selector_engine_1.default.findOne(queries.join(','));
        if (link.classList.contains(CLASS_NAME_DROPDOWN_ITEM)) {
            selector_engine_1.default.findOne(SELECTOR_DROPDOWN_TOGGLE, link.closest(SELECTOR_DROPDOWN)).classList.add(CLASS_NAME_ACTIVE);
            link.classList.add(CLASS_NAME_ACTIVE);
        }
        else {
            // Set triggered link as active
            link.classList.add(CLASS_NAME_ACTIVE);
            selector_engine_1.default.parents(link, SELECTOR_NAV_LIST_GROUP).forEach((listGroup) => {
                // Set triggered links parents as active
                // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor
                selector_engine_1.default.prev(listGroup, `${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}`).forEach((item) => item.classList.add(CLASS_NAME_ACTIVE));
                // Handle special case when .nav-link is inside .nav-item
                selector_engine_1.default.prev(listGroup, SELECTOR_NAV_ITEMS).forEach((navItem) => {
                    selector_engine_1.default.children(navItem, SELECTOR_NAV_LINKS).forEach((item) => item.classList.add(CLASS_NAME_ACTIVE));
                });
            });
        }
        event_handler_1.default.trigger(this._scrollElement, EVENT_ACTIVATE, {
            relatedTarget: target,
        });
    }
    _clear() {
        selector_engine_1.default.find(this._selector)
            .filter((node) => node.classList.contains(CLASS_NAME_ACTIVE))
            .forEach((node) => node.classList.remove(CLASS_NAME_ACTIVE));
    }
    // Static
    static jQueryInterface(config) {
        return this.each(function () {
            let data = data_1.default.getData(this, DATA_KEY);
            const _config = typeof config === 'object' && config;
            if (!data) {
                data = new ScrollSpy(this, _config);
            }
            if (typeof config === 'string') {
                if (typeof data[config] === 'undefined') {
                    throw new TypeError(`No method named "${config}"`);
                }
                data[config]();
            }
        });
    }
}
/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */
event_handler_1.default.on(window, EVENT_LOAD_DATA_API, () => {
    selector_engine_1.default.find(SELECTOR_DATA_SPY).forEach((spy) => new ScrollSpy(spy, manipulator_1.default.getDataAttributes(spy)));
});
/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .ScrollSpy to jQuery only if jQuery is present
 */
(0, index_1.defineJQueryPlugin)(NAME, ScrollSpy);
exports.default = ScrollSpy;
//# sourceMappingURL=scrollspy.js.map