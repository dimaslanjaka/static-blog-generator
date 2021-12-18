"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../mdb/util/index");
const event_handler_1 = __importDefault(require("../mdb/dom/event-handler"));
const selector_engine_1 = __importDefault(require("../mdb/dom/selector-engine"));
const manipulator_1 = __importDefault(require("../mdb/dom/manipulator"));
const dropdown_1 = __importDefault(require("../bootstrap/mdb-prefix/dropdown"));
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */
const NAME = 'dropdown';
const DATA_KEY = `mdb.${NAME}`;
const EVENT_KEY = `.${DATA_KEY}`;
const SELECTOR_EXPAND = '[data-mdb-toggle="dropdown"]';
const Default = {
    offset: [0, 2],
    flip: true,
    boundary: 'clippingParents',
    reference: 'toggle',
    display: 'dynamic',
    popperConfig: null,
    dropdownAnimation: 'on',
};
const DefaultType = {
    offset: '(array|string|function)',
    flip: 'boolean',
    boundary: '(string|element)',
    reference: '(string|element|object)',
    display: 'string',
    popperConfig: '(null|object|function)',
    dropdownAnimation: 'string',
};
const EVENT_HIDE = 'hide.bs.dropdown';
const EVENT_HIDDEN = 'hidden.bs.dropdown';
const EVENT_SHOW = 'show.bs.dropdown';
const EVENT_SHOWN = 'shown.bs.dropdown';
const EVENT_HIDE_MDB = `hide${EVENT_KEY}`;
const EVENT_HIDDEN_MDB = `hidden${EVENT_KEY}`;
const EVENT_SHOW_MDB = `show${EVENT_KEY}`;
const EVENT_SHOWN_MDB = `shown${EVENT_KEY}`;
const ANIMATION_CLASS = 'animation';
const ANIMATION_SHOW_CLASS = 'fade-in';
const ANIMATION_HIDE_CLASS = 'fade-out';
class Dropdown extends dropdown_1.default {
    constructor(element, data) {
        super(element, data);
        this._config = this._getConfig(data);
        this._parent = Dropdown.getParentFromElement(this._element);
        this._menuStyle = '';
        this._popperPlacement = '';
        this._mdbPopperConfig = '';
        //* prevents dropdown close issue when system animation is turned off
        const isPrefersReducedMotionSet = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (this._config.dropdownAnimation === 'on' && !isPrefersReducedMotionSet) {
            this._init();
        }
    }
    dispose() {
        event_handler_1.default.off(this._element, EVENT_SHOW);
        event_handler_1.default.off(this._parent, EVENT_SHOWN);
        event_handler_1.default.off(this._parent, EVENT_HIDE);
        event_handler_1.default.off(this._parent, EVENT_HIDDEN);
        super.dispose();
    }
    // Getters
    static get NAME() {
        return NAME;
    }
    // Private
    _init() {
        this._bindShowEvent();
        this._bindShownEvent();
        this._bindHideEvent();
        this._bindHiddenEvent();
    }
    _getConfig(options) {
        const config = {
            ...Default,
            ...manipulator_1.default.getDataAttributes(this._element),
            ...options,
        };
        (0, index_1.typeCheckConfig)(NAME, config, DefaultType);
        return config;
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
        const popperConfig = {
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
            popperConfig.modifiers = [
                {
                    name: 'applyStyles',
                    enabled: false,
                },
            ];
        }
        return {
            ...popperConfig,
            /* eslint no-extra-parens: "off" */
            ...(typeof this._config.popperConfig === 'function'
                ? this._config.popperConfig(popperConfig)
                : this._config.popperConfig),
        };
    }
    _bindShowEvent() {
        event_handler_1.default.on(this._element, EVENT_SHOW, (e) => {
            event_handler_1.default.trigger(this._element, EVENT_SHOW_MDB, { relatedTarget: e.relatedTarget });
            this._dropdownAnimationStart('show');
        });
    }
    _bindShownEvent() {
        event_handler_1.default.on(this._parent, EVENT_SHOWN, (e) => {
            event_handler_1.default.trigger(this._parent, EVENT_SHOWN_MDB, { relatedTarget: e.relatedTarget });
        });
    }
    _bindHideEvent() {
        event_handler_1.default.on(this._parent, EVENT_HIDE, (e) => {
            event_handler_1.default.trigger(this._parent, EVENT_HIDE_MDB, { relatedTarget: e.relatedTarget });
            this._menuStyle = this._menu.style.cssText;
            this._popperPlacement = this._menu.getAttribute('data-popper-placement');
            this._mdbPopperConfig = this._menu.getAttribute('data-mdb-popper');
        });
    }
    _bindHiddenEvent() {
        event_handler_1.default.on(this._parent, EVENT_HIDDEN, (e) => {
            event_handler_1.default.trigger(this._parent, EVENT_HIDDEN_MDB, { relatedTarget: e.relatedTarget });
            if (this._config.display !== 'static' && this._menuStyle !== '') {
                this._menu.style.cssText = this._menuStyle;
            }
            this._menu.setAttribute('data-popper-placement', this._popperPlacement);
            this._menu.setAttribute('data-mdb-popper', this._mdbPopperConfig);
            this._dropdownAnimationStart('hide');
        });
    }
    _dropdownAnimationStart(action) {
        switch (action) {
            case 'show':
                this._menu.classList.add(ANIMATION_CLASS, ANIMATION_SHOW_CLASS);
                this._menu.classList.remove(ANIMATION_HIDE_CLASS);
                break;
            default:
                // hide
                this._menu.classList.add(ANIMATION_CLASS, ANIMATION_HIDE_CLASS);
                this._menu.classList.remove(ANIMATION_SHOW_CLASS);
                break;
        }
        this._bindAnimationEnd();
    }
    _bindAnimationEnd() {
        event_handler_1.default.one(this._menu, 'animationend', () => {
            this._menu.classList.remove(ANIMATION_CLASS, ANIMATION_HIDE_CLASS, ANIMATION_SHOW_CLASS);
        });
    }
}
/**
 * ------------------------------------------------------------------------
 * Data Api implementation - auto initialization
 * ------------------------------------------------------------------------
 */
selector_engine_1.default.find(SELECTOR_EXPAND).forEach((el) => {
    let instance = Dropdown.getInstance(el);
    if (!instance) {
        instance = new Dropdown(el);
    }
});
/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .rating to jQuery only if jQuery is present
 */
(0, index_1.onDOMContentLoaded)(() => {
    const $ = (0, index_1.getjQuery)();
    if ($) {
        const JQUERY_NO_CONFLICT = $.fn[NAME];
        $.fn[NAME] = Dropdown.jQueryInterface;
        $.fn[NAME].Constructor = Dropdown;
        $.fn[NAME].noConflict = () => {
            $.fn[NAME] = JQUERY_NO_CONFLICT;
            return Dropdown.jQueryInterface;
        };
    }
});
exports.default = Dropdown;
//# sourceMappingURL=dropdown.js.map