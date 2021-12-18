"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../mdb/util/index");
const data_1 = __importDefault(require("../mdb/dom/data"));
const event_handler_1 = __importDefault(require("../mdb/dom/event-handler"));
const manipulator_1 = __importDefault(require("../mdb/dom/manipulator"));
const selector_engine_1 = __importDefault(require("../mdb/dom/selector-engine"));
const button_1 = __importDefault(require("../bootstrap/mdb-prefix/button"));
const NAME = 'button';
const DATA_KEY = `mdb.${NAME}`;
const EVENT_KEY = `.${DATA_KEY}`;
const EVENT_CLICK = `click${EVENT_KEY}`;
const EVENT_TRANSITIONEND = 'transitionend';
const EVENT_MOUSEENTER = 'mouseenter';
const EVENT_MOUSELEAVE = 'mouseleave';
const EVENT_HIDE = `hide${EVENT_KEY}`;
const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
const EVENT_SHOW = `show${EVENT_KEY}`;
const EVENT_SHOWN = `shown${EVENT_KEY}`;
const CLASS_NAME_ACTIVE = 'active';
const CLASS_NAME_SHOWN = 'shown';
const CLASS_NAME_FIXED_ACTION_BTN = 'fixed-action-btn';
const SELECTOR_BUTTON = '[data-mdb-toggle="button"]';
const SELECTOR_FIXED_CONTAINER = '.fixed-action-btn';
const SELECTOR_ACTION_BUTTON = '.fixed-action-btn:not(.smooth-scroll) > .btn-floating';
const SELECTOR_LIST_ELEMENT = 'ul .btn';
const SELECTOR_LIST = 'ul';
class Button extends button_1.default {
    constructor(element) {
        super(element);
        this._fn = {};
        if (this._element) {
            data_1.default.setData(this._element, DATA_KEY, this);
            this._init();
        }
    }
    // Static
    static get NAME() {
        return NAME;
    }
    static jQueryInterface(config, options) {
        return this.each(function () {
            let data = data_1.default.getData(this, DATA_KEY);
            const _config = typeof config === 'object' && config;
            if (!data && /dispose/.test(config)) {
                return;
            }
            if (!data) {
                data = new Button(this, _config);
            }
            if (typeof config === 'string') {
                if (typeof data[config] === 'undefined') {
                    throw new TypeError(`No method named "${config}"`);
                }
                data[config](options);
            }
        });
    }
    // Getters
    get _actionButton() {
        return selector_engine_1.default.findOne(SELECTOR_ACTION_BUTTON, this._element);
    }
    get _buttonListElements() {
        return selector_engine_1.default.find(SELECTOR_LIST_ELEMENT, this._element);
    }
    get _buttonList() {
        return selector_engine_1.default.findOne(SELECTOR_LIST, this._element);
    }
    get _isTouchDevice() {
        return 'ontouchstart' in document.documentElement;
    }
    // Public
    show() {
        if (manipulator_1.default.hasClass(this._element, CLASS_NAME_FIXED_ACTION_BTN)) {
            event_handler_1.default.off(this._buttonList, EVENT_TRANSITIONEND);
            event_handler_1.default.trigger(this._element, EVENT_SHOW);
            // EventHandler.on(this._buttonList, EVENT_TRANSITIONEND, this._bindListOpenTransitionEnd);
            this._bindListOpenTransitionEnd();
            manipulator_1.default.addStyle(this._element, { height: `${this._fullContainerHeight}px` });
            this._toggleVisibility(true);
        }
    }
    hide() {
        if (manipulator_1.default.hasClass(this._element, CLASS_NAME_FIXED_ACTION_BTN)) {
            event_handler_1.default.off(this._buttonList, EVENT_TRANSITIONEND);
            event_handler_1.default.trigger(this._element, EVENT_HIDE);
            // EventHandler.on(this._buttonList, EVENT_TRANSITIONEND, this._bindListHideTransitionEnd);
            this._bindListHideTransitionEnd();
            this._toggleVisibility(false);
        }
    }
    dispose() {
        if (manipulator_1.default.hasClass(this._element, CLASS_NAME_FIXED_ACTION_BTN)) {
            event_handler_1.default.off(this._actionButton, EVENT_CLICK);
            this._actionButton.removeEventListener(EVENT_MOUSEENTER, this._fn.mouseenter);
            this._element.removeEventListener(EVENT_MOUSELEAVE, this._fn.mouseleave);
        }
        super.dispose();
    }
    // Private
    _init() {
        if (manipulator_1.default.hasClass(this._element, CLASS_NAME_FIXED_ACTION_BTN)) {
            this._saveInitialHeights();
            this._setInitialStyles();
            this._bindInitialEvents();
        }
    }
    _bindMouseEnter() {
        this._actionButton.addEventListener(EVENT_MOUSEENTER, 
        // prettier-ignore
        this._fn.mouseenter = () => {
            if (!this._isTouchDevice) {
                this.show();
            }
        }
        // prettier-ignore
        );
    }
    _bindMouseLeave() {
        this._element.addEventListener(EVENT_MOUSELEAVE, 
        // prettier-ignore
        this._fn.mouseleave = () => {
            this.hide();
        }
        // prettier-ignore
        );
    }
    _bindClick() {
        event_handler_1.default.on(this._actionButton, EVENT_CLICK, () => {
            if (manipulator_1.default.hasClass(this._element, CLASS_NAME_ACTIVE)) {
                this.hide();
            }
            else {
                this.show();
            }
        });
    }
    _bindListHideTransitionEnd() {
        event_handler_1.default.on(this._buttonList, EVENT_TRANSITIONEND, (event) => {
            if (event.propertyName === 'transform') {
                event_handler_1.default.off(this._buttonList, EVENT_TRANSITIONEND);
                this._element.style.height = `${this._initialContainerHeight}px`;
                event_handler_1.default.trigger(this._element, EVENT_HIDDEN);
            }
        });
    }
    _bindListOpenTransitionEnd() {
        event_handler_1.default.on(this._buttonList, EVENT_TRANSITIONEND, (event) => {
            if (event.propertyName === 'transform') {
                event_handler_1.default.off(this._buttonList, EVENT_TRANSITIONEND);
                event_handler_1.default.trigger(this._element, EVENT_SHOWN);
            }
        });
    }
    _toggleVisibility(isVisible) {
        const action = isVisible ? 'addClass' : 'removeClass';
        const listTranslate = isVisible ? 'translate(0)' : `translateY(${this._fullContainerHeight}px)`;
        manipulator_1.default.addStyle(this._buttonList, { transform: listTranslate });
        if (this._buttonListElements) {
            this._buttonListElements.forEach((el) => manipulator_1.default[action](el, CLASS_NAME_SHOWN));
        }
        manipulator_1.default[action](this._element, CLASS_NAME_ACTIVE);
    }
    _getHeight(element) {
        const computed = window.getComputedStyle(element);
        const height = parseFloat(computed.getPropertyValue('height'));
        return height;
    }
    _saveInitialHeights() {
        this._initialContainerHeight = this._getHeight(this._element);
        this._initialListHeight = this._getHeight(this._buttonList);
        this._fullContainerHeight = this._initialContainerHeight + this._initialListHeight;
    }
    _bindInitialEvents() {
        this._bindClick();
        this._bindMouseEnter();
        this._bindMouseLeave();
    }
    _setInitialStyles() {
        this._buttonList.style.marginBottom = `${this._initialContainerHeight}px`;
        this._buttonList.style.transform = `translateY(${this._fullContainerHeight}px)`;
        this._element.style.height = `${this._initialContainerHeight}px`;
    }
}
/**
 * ------------------------------------------------------------------------
 * Data Api implementation - auto initialization
 * ------------------------------------------------------------------------
 */
selector_engine_1.default.find(SELECTOR_FIXED_CONTAINER).forEach((element) => {
    let instance = Button.getInstance(element);
    if (!instance) {
        instance = new Button(element);
    }
    return instance;
});
selector_engine_1.default.find(SELECTOR_BUTTON).forEach((element) => {
    let instance = Button.getInstance(element);
    if (!instance) {
        instance = new Button(element);
    }
    return instance;
});
/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 */
(0, index_1.onDOMContentLoaded)(() => {
    const $ = (0, index_1.getjQuery)();
    if ($) {
        const JQUERY_NO_CONFLICT = $.fn[NAME];
        $.fn[NAME] = Button.jQueryInterface;
        $.fn[NAME].Constructor = Button;
        $.fn[NAME].noConflict = () => {
            $.fn[NAME] = JQUERY_NO_CONFLICT;
            return Button.jQueryInterface;
        };
    }
});
exports.default = Button;
//# sourceMappingURL=button.js.map