"use strict";
/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.0-beta2): collapse.js
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
const NAME = 'collapse';
const DATA_KEY = 'bs.collapse';
const EVENT_KEY = `.${DATA_KEY}`;
const DATA_API_KEY = '.data-api';
const Default = {
    toggle: true,
    parent: '',
};
const DefaultType = {
    toggle: 'boolean',
    parent: '(string|element)',
};
const EVENT_SHOW = `show${EVENT_KEY}`;
const EVENT_SHOWN = `shown${EVENT_KEY}`;
const EVENT_HIDE = `hide${EVENT_KEY}`;
const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
const CLASS_NAME_SHOW = 'show';
const CLASS_NAME_COLLAPSE = 'collapse';
const CLASS_NAME_COLLAPSING = 'collapsing';
const CLASS_NAME_COLLAPSED = 'collapsed';
const WIDTH = 'width';
const HEIGHT = 'height';
const SELECTOR_ACTIVES = '.show, .collapsing';
const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="collapse"]';
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */
class Collapse extends base_component_1.default {
    constructor(element, config) {
        super(element);
        this._isTransitioning = false;
        this._config = this._getConfig(config);
        this._triggerArray = selector_engine_1.default.find(`${SELECTOR_DATA_TOGGLE}[href="#${element.id}"],` +
            `${SELECTOR_DATA_TOGGLE}[data-bs-target="#${element.id}"]`);
        const toggleList = selector_engine_1.default.find(SELECTOR_DATA_TOGGLE);
        for (let i = 0, len = toggleList.length; i < len; i++) {
            const elem = toggleList[i];
            const selector = (0, index_1.getSelectorFromElement)(elem);
            const filterElement = selector_engine_1.default.find(selector).filter((foundElem) => foundElem === element);
            if (selector !== null && filterElement.length) {
                this._selector = selector;
                this._triggerArray.push(elem);
            }
        }
        this._parent = this._config.parent ? this._getParent() : null;
        if (!this._config.parent) {
            this._addAriaAndCollapsedClass(this._element, this._triggerArray);
        }
        if (this._config.toggle) {
            this.toggle();
        }
    }
    // Getters
    static get Default() {
        return Default;
    }
    static get DATA_KEY() {
        return DATA_KEY;
    }
    // Public
    toggle() {
        if (this._element.classList.contains(CLASS_NAME_SHOW)) {
            this.hide();
        }
        else {
            this.show();
        }
    }
    show() {
        if (this._isTransitioning || this._element.classList.contains(CLASS_NAME_SHOW)) {
            return;
        }
        let actives;
        let activesData;
        if (this._parent) {
            actives = selector_engine_1.default.find(SELECTOR_ACTIVES, this._parent).filter((elem) => {
                if (typeof this._config.parent === 'string') {
                    return elem.getAttribute('data-bs-parent') === this._config.parent;
                }
                return elem.classList.contains(CLASS_NAME_COLLAPSE);
            });
            if (actives.length === 0) {
                actives = null;
            }
        }
        const container = selector_engine_1.default.findOne(this._selector);
        if (actives) {
            const tempActiveData = actives.find((elem) => container !== elem);
            activesData = tempActiveData ? data_1.default.getData(tempActiveData, DATA_KEY) : null;
            if (activesData && activesData._isTransitioning) {
                return;
            }
        }
        const startEvent = event_handler_1.default.trigger(this._element, EVENT_SHOW);
        if (startEvent.defaultPrevented) {
            return;
        }
        if (actives) {
            actives.forEach((elemActive) => {
                if (container !== elemActive) {
                    Collapse.collapseInterface(elemActive, 'hide');
                }
                if (!activesData) {
                    data_1.default.setData(elemActive, DATA_KEY, null);
                }
            });
        }
        const dimension = this._getDimension();
        this._element.classList.remove(CLASS_NAME_COLLAPSE);
        this._element.classList.add(CLASS_NAME_COLLAPSING);
        this._element.style[dimension] = 0;
        if (this._triggerArray.length) {
            this._triggerArray.forEach((element) => {
                element.classList.remove(CLASS_NAME_COLLAPSED);
                element.setAttribute('aria-expanded', true);
            });
        }
        this.setTransitioning(true);
        const complete = () => {
            this._element.classList.remove(CLASS_NAME_COLLAPSING);
            this._element.classList.add(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW);
            this._element.style[dimension] = '';
            this.setTransitioning(false);
            event_handler_1.default.trigger(this._element, EVENT_SHOWN);
        };
        const capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
        const scrollSize = `scroll${capitalizedDimension}`;
        const transitionDuration = (0, index_1.getTransitionDurationFromElement)(this._element);
        event_handler_1.default.one(this._element, 'transitionend', complete);
        (0, index_1.emulateTransitionEnd)(this._element, transitionDuration);
        this._element.style[dimension] = `${this._element[scrollSize]}px`;
    }
    hide() {
        if (this._isTransitioning || !this._element.classList.contains(CLASS_NAME_SHOW)) {
            return;
        }
        const startEvent = event_handler_1.default.trigger(this._element, EVENT_HIDE);
        if (startEvent.defaultPrevented) {
            return;
        }
        const dimension = this._getDimension();
        this._element.style[dimension] = `${this._element.getBoundingClientRect()[dimension]}px`;
        (0, index_1.reflow)(this._element);
        this._element.classList.add(CLASS_NAME_COLLAPSING);
        this._element.classList.remove(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW);
        const triggerArrayLength = this._triggerArray.length;
        if (triggerArrayLength > 0) {
            for (let i = 0; i < triggerArrayLength; i++) {
                const trigger = this._triggerArray[i];
                const elem = (0, index_1.getElementFromSelector)(trigger);
                if (elem && !elem.classList.contains(CLASS_NAME_SHOW)) {
                    trigger.classList.add(CLASS_NAME_COLLAPSED);
                    trigger.setAttribute('aria-expanded', false);
                }
            }
        }
        this.setTransitioning(true);
        const complete = () => {
            this.setTransitioning(false);
            this._element.classList.remove(CLASS_NAME_COLLAPSING);
            this._element.classList.add(CLASS_NAME_COLLAPSE);
            event_handler_1.default.trigger(this._element, EVENT_HIDDEN);
        };
        this._element.style[dimension] = '';
        const transitionDuration = (0, index_1.getTransitionDurationFromElement)(this._element);
        event_handler_1.default.one(this._element, 'transitionend', complete);
        (0, index_1.emulateTransitionEnd)(this._element, transitionDuration);
    }
    setTransitioning(isTransitioning) {
        this._isTransitioning = isTransitioning;
    }
    dispose() {
        super.dispose();
        this._config = null;
        this._parent = null;
        this._triggerArray = null;
        this._isTransitioning = null;
    }
    // Private
    _getConfig(config) {
        config = {
            ...Default,
            ...config,
        };
        config.toggle = Boolean(config.toggle); // Coerce string values
        (0, index_1.typeCheckConfig)(NAME, config, DefaultType);
        return config;
    }
    _getDimension() {
        return this._element.classList.contains(WIDTH) ? WIDTH : HEIGHT;
    }
    _getParent() {
        let { parent } = this._config;
        if ((0, index_1.isElement)(parent)) {
            // it's a jQuery object
            if (typeof parent.jquery !== 'undefined' || typeof parent[0] !== 'undefined') {
                parent = parent[0];
            }
        }
        else {
            parent = selector_engine_1.default.findOne(parent);
        }
        const selector = `${SELECTOR_DATA_TOGGLE}[data-bs-parent="${parent}"]`;
        selector_engine_1.default.find(selector, parent).forEach((element) => {
            const selected = (0, index_1.getElementFromSelector)(element);
            this._addAriaAndCollapsedClass(selected, [element]);
        });
        return parent;
    }
    _addAriaAndCollapsedClass(element, triggerArray) {
        if (!element || !triggerArray.length) {
            return;
        }
        const isOpen = element.classList.contains(CLASS_NAME_SHOW);
        triggerArray.forEach((elem) => {
            if (isOpen) {
                elem.classList.remove(CLASS_NAME_COLLAPSED);
            }
            else {
                elem.classList.add(CLASS_NAME_COLLAPSED);
            }
            elem.setAttribute('aria-expanded', isOpen);
        });
    }
    // Static
    static collapseInterface(element, config) {
        let data = data_1.default.getData(element, DATA_KEY);
        const _config = {
            ...Default,
            ...manipulator_1.default.getDataAttributes(element),
            ...(typeof config === 'object' && config ? config : {}),
        };
        if (!data && _config.toggle && typeof config === 'string' && /show|hide/.test(config)) {
            _config.toggle = false;
        }
        if (!data) {
            data = new Collapse(element, _config);
        }
        if (typeof config === 'string') {
            if (typeof data[config] === 'undefined') {
                throw new TypeError(`No method named "${config}"`);
            }
            data[config]();
        }
    }
    static jQueryInterface(config) {
        return this.each(function () {
            Collapse.collapseInterface(this, config);
        });
    }
}
/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */
event_handler_1.default.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
    // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
    if (event.target.tagName === 'A' ||
        (event.delegateTarget && event.delegateTarget.tagName === 'A')) {
        event.preventDefault();
    }
    const triggerData = manipulator_1.default.getDataAttributes(this);
    const selector = (0, index_1.getSelectorFromElement)(this);
    const selectorElements = selector_engine_1.default.find(selector);
    selectorElements.forEach((element) => {
        const data = data_1.default.getData(element, DATA_KEY);
        let config;
        if (data) {
            // update parent attribute
            if (data._parent === null && typeof triggerData.parent === 'string') {
                data._config.parent = triggerData.parent;
                data._parent = data._getParent();
            }
            config = 'toggle';
        }
        else {
            config = triggerData;
        }
        Collapse.collapseInterface(element, config);
    });
});
/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .Collapse to jQuery only if jQuery is present
 */
(0, index_1.defineJQueryPlugin)(NAME, Collapse);
exports.default = Collapse;
//# sourceMappingURL=collapse.js.map