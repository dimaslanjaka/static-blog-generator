"use strict";
/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.0-beta2): tab.js
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
const selector_engine_1 = __importDefault(require("./dom/selector-engine"));
const base_component_1 = __importDefault(require("./base-component"));
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */
const NAME = 'tab';
const DATA_KEY = 'bs.tab';
const EVENT_KEY = `.${DATA_KEY}`;
const DATA_API_KEY = '.data-api';
const EVENT_HIDE = `hide${EVENT_KEY}`;
const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
const EVENT_SHOW = `show${EVENT_KEY}`;
const EVENT_SHOWN = `shown${EVENT_KEY}`;
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
const CLASS_NAME_DROPDOWN_MENU = 'dropdown-menu';
const CLASS_NAME_ACTIVE = 'active';
const CLASS_NAME_DISABLED = 'disabled';
const CLASS_NAME_FADE = 'fade';
const CLASS_NAME_SHOW = 'show';
const SELECTOR_DROPDOWN = '.dropdown';
const SELECTOR_NAV_LIST_GROUP = '.nav, .list-group';
const SELECTOR_ACTIVE = '.active';
const SELECTOR_ACTIVE_UL = ':scope > li > .active';
const SELECTOR_DATA_TOGGLE = '[data-mdb-toggle="tab"], [data-mdb-toggle="pill"], [data-mdb-toggle="list"]';
const SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle';
const SELECTOR_DROPDOWN_ACTIVE_CHILD = ':scope > .dropdown-menu .active';
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */
class Tab extends base_component_1.default {
    // Getters
    static get DATA_KEY() {
        return DATA_KEY;
    }
    // Public
    show() {
        if ((this._element.parentNode &&
            this._element.parentNode.nodeType === Node.ELEMENT_NODE &&
            this._element.classList.contains(CLASS_NAME_ACTIVE)) ||
            this._element.classList.contains(CLASS_NAME_DISABLED)) {
            return;
        }
        let previous;
        const target = (0, index_1.getElementFromSelector)(this._element);
        const listElement = this._element.closest(SELECTOR_NAV_LIST_GROUP);
        if (listElement) {
            const itemSelector = listElement.nodeName === 'UL' || listElement.nodeName === 'OL'
                ? SELECTOR_ACTIVE_UL
                : SELECTOR_ACTIVE;
            previous = selector_engine_1.default.find(itemSelector, listElement);
            previous = previous[previous.length - 1];
        }
        const hideEvent = previous
            ? event_handler_1.default.trigger(previous, EVENT_HIDE, {
                relatedTarget: this._element,
            })
            : null;
        const showEvent = event_handler_1.default.trigger(this._element, EVENT_SHOW, {
            relatedTarget: previous,
        });
        if (showEvent.defaultPrevented || (hideEvent !== null && hideEvent.defaultPrevented)) {
            return;
        }
        this._activate(this._element, listElement);
        const complete = () => {
            event_handler_1.default.trigger(previous, EVENT_HIDDEN, {
                relatedTarget: this._element,
            });
            event_handler_1.default.trigger(this._element, EVENT_SHOWN, {
                relatedTarget: previous,
            });
        };
        if (target) {
            this._activate(target, target.parentNode, complete);
        }
        else {
            complete();
        }
    }
    // Private
    _activate(element, container, callback) {
        const activeElements = container && (container.nodeName === 'UL' || container.nodeName === 'OL')
            ? selector_engine_1.default.find(SELECTOR_ACTIVE_UL, container)
            : selector_engine_1.default.children(container, SELECTOR_ACTIVE);
        const active = activeElements[0];
        const isTransitioning = callback && active && active.classList.contains(CLASS_NAME_FADE);
        const complete = () => this._transitionComplete(element, active, callback);
        if (active && isTransitioning) {
            const transitionDuration = (0, index_1.getTransitionDurationFromElement)(active);
            active.classList.remove(CLASS_NAME_SHOW);
            event_handler_1.default.one(active, 'transitionend', complete);
            (0, index_1.emulateTransitionEnd)(active, transitionDuration);
        }
        else {
            complete();
        }
    }
    _transitionComplete(element, active, callback) {
        if (active) {
            active.classList.remove(CLASS_NAME_ACTIVE);
            const dropdownChild = selector_engine_1.default.findOne(SELECTOR_DROPDOWN_ACTIVE_CHILD, active.parentNode);
            if (dropdownChild) {
                dropdownChild.classList.remove(CLASS_NAME_ACTIVE);
            }
            if (active.getAttribute('role') === 'tab') {
                active.setAttribute('aria-selected', false);
            }
        }
        element.classList.add(CLASS_NAME_ACTIVE);
        if (element.getAttribute('role') === 'tab') {
            element.setAttribute('aria-selected', true);
        }
        (0, index_1.reflow)(element);
        if (element.classList.contains(CLASS_NAME_FADE)) {
            element.classList.add(CLASS_NAME_SHOW);
        }
        if (element.parentNode && element.parentNode.classList.contains(CLASS_NAME_DROPDOWN_MENU)) {
            const dropdownElement = element.closest(SELECTOR_DROPDOWN);
            if (dropdownElement) {
                selector_engine_1.default.find(SELECTOR_DROPDOWN_TOGGLE).forEach((dropdown) => dropdown.classList.add(CLASS_NAME_ACTIVE));
            }
            element.setAttribute('aria-expanded', true);
        }
        if (callback) {
            callback();
        }
    }
    // Static
    static jQueryInterface(config) {
        return this.each(function () {
            const data = data_1.default.getData(this, DATA_KEY) || new Tab(this);
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
event_handler_1.default.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
    event.preventDefault();
    const data = data_1.default.getData(this, DATA_KEY) || new Tab(this);
    data.show();
});
/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .Tab to jQuery only if jQuery is present
 */
(0, index_1.defineJQueryPlugin)(NAME, Tab);
exports.default = Tab;
//# sourceMappingURL=tab.js.map