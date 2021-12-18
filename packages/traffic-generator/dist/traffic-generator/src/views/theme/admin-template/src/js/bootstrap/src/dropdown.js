"use strict";
/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.0-beta2): dropdown.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
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
const Popper = __importStar(require("@popperjs/core"));
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
const NAME = 'dropdown';
const DATA_KEY = 'bs.dropdown';
const EVENT_KEY = `.${DATA_KEY}`;
const DATA_API_KEY = '.data-api';
const ESCAPE_KEY = 'Escape';
const SPACE_KEY = 'Space';
const TAB_KEY = 'Tab';
const ARROW_UP_KEY = 'ArrowUp';
const ARROW_DOWN_KEY = 'ArrowDown';
const RIGHT_MOUSE_BUTTON = 2; // MouseEvent.button value for the secondary button, usually the right button
const REGEXP_KEYDOWN = new RegExp(`${ARROW_UP_KEY}|${ARROW_DOWN_KEY}|${ESCAPE_KEY}`);
const EVENT_HIDE = `hide${EVENT_KEY}`;
const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
const EVENT_SHOW = `show${EVENT_KEY}`;
const EVENT_SHOWN = `shown${EVENT_KEY}`;
const EVENT_CLICK = `click${EVENT_KEY}`;
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY}${DATA_API_KEY}`;
const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY}${DATA_API_KEY}`;
const CLASS_NAME_DISABLED = 'disabled';
const CLASS_NAME_SHOW = 'show';
const CLASS_NAME_DROPUP = 'dropup';
const CLASS_NAME_DROPEND = 'dropend';
const CLASS_NAME_DROPSTART = 'dropstart';
const CLASS_NAME_NAVBAR = 'navbar';
const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="dropdown"]';
const SELECTOR_FORM_CHILD = '.dropdown form';
const SELECTOR_MENU = '.dropdown-menu';
const SELECTOR_NAVBAR_NAV = '.navbar-nav';
const SELECTOR_VISIBLE_ITEMS = '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)';
const PLACEMENT_TOP = index_1.isRTL ? 'top-end' : 'top-start';
const PLACEMENT_TOPEND = index_1.isRTL ? 'top-start' : 'top-end';
const PLACEMENT_BOTTOM = index_1.isRTL ? 'bottom-end' : 'bottom-start';
const PLACEMENT_BOTTOMEND = index_1.isRTL ? 'bottom-start' : 'bottom-end';
const PLACEMENT_RIGHT = index_1.isRTL ? 'left-start' : 'right-start';
const PLACEMENT_LEFT = index_1.isRTL ? 'right-start' : 'left-start';
const Default = {
    offset: [0, 2],
    flip: true,
    boundary: 'clippingParents',
    reference: 'toggle',
    display: 'dynamic',
    popperConfig: null,
};
const DefaultType = {
    offset: '(array|string|function)',
    flip: 'boolean',
    boundary: '(string|element)',
    reference: '(string|element|object)',
    display: 'string',
    popperConfig: '(null|object|function)',
};
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */
class Dropdown extends base_component_1.default {
    constructor(element, config) {
        super(element);
        this._popper = null;
        this._config = this._getConfig(config);
        this._menu = this._getMenuElement();
        this._inNavbar = this._detectNavbar();
        this._addEventListeners();
    }
    // Getters
    static get Default() {
        return Default;
    }
    static get DefaultType() {
        return DefaultType;
    }
    static get DATA_KEY() {
        return DATA_KEY;
    }
    // Public
    toggle() {
        if (this._element.disabled || this._element.classList.contains(CLASS_NAME_DISABLED)) {
            return;
        }
        const isActive = this._element.classList.contains(CLASS_NAME_SHOW);
        Dropdown.clearMenus();
        if (isActive) {
            return;
        }
        this.show();
    }
    show() {
        if (this._element.disabled ||
            this._element.classList.contains(CLASS_NAME_DISABLED) ||
            this._menu.classList.contains(CLASS_NAME_SHOW)) {
            return;
        }
        const parent = Dropdown.getParentFromElement(this._element);
        const relatedTarget = {
            relatedTarget: this._element,
        };
        const showEvent = event_handler_1.default.trigger(this._element, EVENT_SHOW, relatedTarget);
        if (showEvent.defaultPrevented) {
            return;
        }
        // Totally disable Popper for Dropdowns in Navbar
        if (this._inNavbar) {
            manipulator_1.default.setDataAttribute(this._menu, 'popper', 'none');
        }
        else {
            if (typeof Popper === 'undefined') {
                throw new TypeError("Bootstrap's dropdowns require Popper (https://popper.js.org)");
            }
            let referenceElement = this._element;
            if (this._config.reference === 'parent') {
                referenceElement = parent;
            }
            else if ((0, index_1.isElement)(this._config.reference)) {
                referenceElement = this._config.reference;
                // Check if it's jQuery element
                if (typeof this._config.reference.jquery !== 'undefined') {
                    referenceElement = this._config.reference[0];
                }
            }
            else if (typeof this._config.reference === 'object') {
                referenceElement = this._config.reference;
            }
            const popperConfig = this._getPopperConfig();
            const isDisplayStatic = popperConfig.modifiers.find((modifier) => modifier.name === 'applyStyles' && modifier.enabled === false);
            this._popper = Popper.createPopper(referenceElement, this._menu, popperConfig);
            if (isDisplayStatic) {
                manipulator_1.default.setDataAttribute(this._menu, 'popper', 'static');
            }
        }
        // If this is a touch-enabled device we add extra
        // empty mouseover listeners to the body's immediate children;
        // only needed because of broken event delegation on iOS
        // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
        if ('ontouchstart' in document.documentElement && !parent.closest(SELECTOR_NAVBAR_NAV)) {
            []
                .concat(...document.body.children)
                .forEach((elem) => event_handler_1.default.on(elem, 'mouseover', null, (0, index_1.noop)()));
        }
        this._element.focus();
        this._element.setAttribute('aria-expanded', true);
        this._menu.classList.toggle(CLASS_NAME_SHOW);
        this._element.classList.toggle(CLASS_NAME_SHOW);
        event_handler_1.default.trigger(this._element, EVENT_SHOWN, relatedTarget);
    }
    hide() {
        if (this._element.disabled ||
            this._element.classList.contains(CLASS_NAME_DISABLED) ||
            !this._menu.classList.contains(CLASS_NAME_SHOW)) {
            return;
        }
        const relatedTarget = {
            relatedTarget: this._element,
        };
        const hideEvent = event_handler_1.default.trigger(this._element, EVENT_HIDE, relatedTarget);
        if (hideEvent.defaultPrevented) {
            return;
        }
        if (this._popper) {
            this._popper.destroy();
        }
        this._menu.classList.toggle(CLASS_NAME_SHOW);
        this._element.classList.toggle(CLASS_NAME_SHOW);
        manipulator_1.default.removeDataAttribute(this._menu, 'popper');
        event_handler_1.default.trigger(this._element, EVENT_HIDDEN, relatedTarget);
    }
    dispose() {
        super.dispose();
        event_handler_1.default.off(this._element, EVENT_KEY);
        this._menu = null;
        if (this._popper) {
            this._popper.destroy();
            this._popper = null;
        }
    }
    update() {
        this._inNavbar = this._detectNavbar();
        if (this._popper) {
            this._popper.update();
        }
    }
    // Private
    _addEventListeners() {
        event_handler_1.default.on(this._element, EVENT_CLICK, (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.toggle();
        });
    }
    _getConfig(config) {
        config = {
            ...this.constructor.Default,
            ...manipulator_1.default.getDataAttributes(this._element),
            ...config,
        };
        (0, index_1.typeCheckConfig)(NAME, config, this.constructor.DefaultType);
        if (typeof config.reference === 'object' &&
            !(0, index_1.isElement)(config.reference) &&
            typeof config.reference.getBoundingClientRect !== 'function') {
            // Popper virtual elements require a getBoundingClientRect method
            throw new TypeError(`${NAME.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`);
        }
        return config;
    }
    _getMenuElement() {
        return selector_engine_1.default.next(this._element, SELECTOR_MENU)[0];
    }
    _getPlacement() {
        const parentDropdown = this._element.parentNode;
        if (parentDropdown.classList.contains(CLASS_NAME_DROPEND)) {
            return PLACEMENT_RIGHT;
        }
        if (parentDropdown.classList.contains(CLASS_NAME_DROPSTART)) {
            return PLACEMENT_LEFT;
        }
        // We need to trim the value because custom properties can also include spaces
        const isEnd = getComputedStyle(this._menu).getPropertyValue('--bs-position').trim() === 'end';
        if (parentDropdown.classList.contains(CLASS_NAME_DROPUP)) {
            return isEnd ? PLACEMENT_TOPEND : PLACEMENT_TOP;
        }
        return isEnd ? PLACEMENT_BOTTOMEND : PLACEMENT_BOTTOM;
    }
    _detectNavbar() {
        return this._element.closest(`.${CLASS_NAME_NAVBAR}`) !== null;
    }
    _getOffset() {
        const { offset } = this._config;
        if (typeof offset === 'string') {
            return offset.split(',').map((val) => Number.parseInt(val, 10));
        }
        if (typeof offset === 'function') {
            return (popperData) => offset(popperData, this._element);
        }
        return offset;
    }
    _getPopperConfig() {
        const defaultBsPopperConfig = {
            placement: this._getPlacement(),
            modifiers: [
                {
                    name: 'preventOverflow',
                    options: {
                        altBoundary: this._config.flip,
                        boundary: this._config.boundary,
                    },
                },
                {
                    name: 'offset',
                    options: {
                        offset: this._getOffset(),
                    },
                },
            ],
        };
        // Disable Popper if we have a static display
        if (this._config.display === 'static') {
            defaultBsPopperConfig.modifiers = [
                {
                    name: 'applyStyles',
                    enabled: false,
                },
            ];
        }
        return {
            ...defaultBsPopperConfig,
            ...(typeof this._config.popperConfig === 'function'
                ? this._config.popperConfig(defaultBsPopperConfig)
                : this._config.popperConfig),
        };
    }
    // Static
    static dropdownInterface(element, config) {
        let data = data_1.default.getData(element, DATA_KEY);
        const _config = typeof config === 'object' ? config : null;
        if (!data) {
            data = new Dropdown(element, _config);
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
            Dropdown.dropdownInterface(this, config);
        });
    }
    static clearMenus(event) {
        if (event &&
            (event.button === RIGHT_MOUSE_BUTTON || (event.type === 'keyup' && event.key !== TAB_KEY))) {
            return;
        }
        const toggles = selector_engine_1.default.find(SELECTOR_DATA_TOGGLE);
        for (let i = 0, len = toggles.length; i < len; i++) {
            const context = data_1.default.getData(toggles[i], DATA_KEY);
            const relatedTarget = {
                relatedTarget: toggles[i],
            };
            if (event && event.type === 'click') {
                relatedTarget.clickEvent = event;
            }
            if (!context) {
                continue;
            }
            const dropdownMenu = context._menu;
            if (!toggles[i].classList.contains(CLASS_NAME_SHOW)) {
                continue;
            }
            if (event &&
                ((event.type === 'click' && /input|textarea/i.test(event.target.tagName)) ||
                    (event.type === 'keyup' && event.key === TAB_KEY)) &&
                dropdownMenu.contains(event.target)) {
                continue;
            }
            const hideEvent = event_handler_1.default.trigger(toggles[i], EVENT_HIDE, relatedTarget);
            if (hideEvent.defaultPrevented) {
                continue;
            }
            // If this is a touch-enabled device we remove the extra
            // empty mouseover listeners we added for iOS support
            if ('ontouchstart' in document.documentElement) {
                []
                    .concat(...document.body.children)
                    .forEach((elem) => event_handler_1.default.off(elem, 'mouseover', null, (0, index_1.noop)()));
            }
            toggles[i].setAttribute('aria-expanded', 'false');
            if (context._popper) {
                context._popper.destroy();
            }
            dropdownMenu.classList.remove(CLASS_NAME_SHOW);
            toggles[i].classList.remove(CLASS_NAME_SHOW);
            manipulator_1.default.removeDataAttribute(dropdownMenu, 'popper');
            event_handler_1.default.trigger(toggles[i], EVENT_HIDDEN, relatedTarget);
        }
    }
    static getParentFromElement(element) {
        return (0, index_1.getElementFromSelector)(element) || element.parentNode;
    }
    static dataApiKeydownHandler(event) {
        // If not input/textarea:
        //  - And not a key in REGEXP_KEYDOWN => not a dropdown command
        // If input/textarea:
        //  - If space key => not a dropdown command
        //  - If key is other than escape
        //    - If key is not up or down => not a dropdown command
        //    - If trigger inside the menu => not a dropdown command
        if (/input|textarea/i.test(event.target.tagName)
            ? event.key === SPACE_KEY ||
                (event.key !== ESCAPE_KEY &&
                    ((event.key !== ARROW_DOWN_KEY && event.key !== ARROW_UP_KEY) ||
                        event.target.closest(SELECTOR_MENU)))
            : !REGEXP_KEYDOWN.test(event.key)) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        if (this.disabled || this.classList.contains(CLASS_NAME_DISABLED)) {
            return;
        }
        const parent = Dropdown.getParentFromElement(this);
        const isActive = this.classList.contains(CLASS_NAME_SHOW);
        if (event.key === ESCAPE_KEY) {
            const button = this.matches(SELECTOR_DATA_TOGGLE)
                ? this
                : selector_engine_1.default.prev(this, SELECTOR_DATA_TOGGLE)[0];
            button.focus();
            Dropdown.clearMenus();
            return;
        }
        if (!isActive && (event.key === ARROW_UP_KEY || event.key === ARROW_DOWN_KEY)) {
            const button = this.matches(SELECTOR_DATA_TOGGLE)
                ? this
                : selector_engine_1.default.prev(this, SELECTOR_DATA_TOGGLE)[0];
            button.click();
            return;
        }
        if (!isActive || event.key === SPACE_KEY) {
            Dropdown.clearMenus();
            return;
        }
        const items = selector_engine_1.default.find(SELECTOR_VISIBLE_ITEMS, parent).filter(index_1.isVisible);
        if (!items.length) {
            return;
        }
        let index = items.indexOf(event.target);
        // Up
        if (event.key === ARROW_UP_KEY && index > 0) {
            index--;
        }
        // Down
        if (event.key === ARROW_DOWN_KEY && index < items.length - 1) {
            index++;
        }
        // index is -1 if the first keydown is an ArrowUp
        index = index === -1 ? 0 : index;
        items[index].focus();
    }
}
/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */
event_handler_1.default.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE, Dropdown.dataApiKeydownHandler);
event_handler_1.default.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Dropdown.dataApiKeydownHandler);
event_handler_1.default.on(document, EVENT_CLICK_DATA_API, Dropdown.clearMenus);
event_handler_1.default.on(document, EVENT_KEYUP_DATA_API, Dropdown.clearMenus);
event_handler_1.default.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
    event.preventDefault();
    event.stopPropagation();
    Dropdown.dropdownInterface(this, 'toggle');
});
event_handler_1.default.on(document, EVENT_CLICK_DATA_API, SELECTOR_FORM_CHILD, (e) => e.stopPropagation());
/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .Dropdown to jQuery only if jQuery is present
 */
(0, index_1.defineJQueryPlugin)(NAME, Dropdown);
exports.default = Dropdown;
//# sourceMappingURL=dropdown.js.map