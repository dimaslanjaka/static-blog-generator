"use strict";
/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.0-beta2): modal.js
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
const NAME = 'modal';
const DATA_KEY = 'bs.modal';
const EVENT_KEY = `.${DATA_KEY}`;
const DATA_API_KEY = '.data-api';
const ESCAPE_KEY = 'Escape';
const Default = {
    backdrop: true,
    keyboard: true,
    focus: true,
};
const DefaultType = {
    backdrop: '(boolean|string)',
    keyboard: 'boolean',
    focus: 'boolean',
};
const EVENT_HIDE = `hide${EVENT_KEY}`;
const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY}`;
const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
const EVENT_SHOW = `show${EVENT_KEY}`;
const EVENT_SHOWN = `shown${EVENT_KEY}`;
const EVENT_FOCUSIN = `focusin${EVENT_KEY}`;
const EVENT_RESIZE = `resize${EVENT_KEY}`;
const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY}`;
const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY}`;
const EVENT_MOUSEUP_DISMISS = `mouseup.dismiss${EVENT_KEY}`;
const EVENT_MOUSEDOWN_DISMISS = `mousedown.dismiss${EVENT_KEY}`;
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
const CLASS_NAME_SCROLLBAR_MEASURER = 'modal-scrollbar-measure';
const CLASS_NAME_BACKDROP = 'modal-backdrop';
const CLASS_NAME_OPEN = 'modal-open';
const CLASS_NAME_FADE = 'fade';
const CLASS_NAME_SHOW = 'show';
const CLASS_NAME_STATIC = 'modal-static';
const SELECTOR_DIALOG = '.modal-dialog';
const SELECTOR_MODAL_BODY = '.modal-body';
const SELECTOR_DATA_TOGGLE = '[data-mdb-toggle="modal"]';
const SELECTOR_DATA_DISMISS = '[data-mdb-dismiss="modal"]';
const SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top';
const SELECTOR_STICKY_CONTENT = '.sticky-top';
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */
class Modal extends base_component_1.default {
    constructor(element, config) {
        super(element);
        this._config = this._getConfig(config);
        this._dialog = selector_engine_1.default.findOne(SELECTOR_DIALOG, element);
        this._backdrop = null;
        this._isShown = false;
        this._isBodyOverflowing = false;
        this._ignoreBackdropClick = false;
        this._isTransitioning = false;
        this._scrollbarWidth = 0;
    }
    // Getters
    static get Default() {
        return Default;
    }
    static get DATA_KEY() {
        return DATA_KEY;
    }
    // Public
    toggle(relatedTarget) {
        return this._isShown ? this.hide() : this.show(relatedTarget);
    }
    show(relatedTarget) {
        if (this._isShown || this._isTransitioning) {
            return;
        }
        if (this._element.classList.contains(CLASS_NAME_FADE)) {
            this._isTransitioning = true;
        }
        const showEvent = event_handler_1.default.trigger(this._element, EVENT_SHOW, {
            relatedTarget,
        });
        if (this._isShown || showEvent.defaultPrevented) {
            return;
        }
        this._isShown = true;
        this._checkScrollbar();
        this._setScrollbar();
        this._adjustDialog();
        this._setEscapeEvent();
        this._setResizeEvent();
        event_handler_1.default.on(this._element, EVENT_CLICK_DISMISS, SELECTOR_DATA_DISMISS, (event) => this.hide(event));
        event_handler_1.default.on(this._dialog, EVENT_MOUSEDOWN_DISMISS, () => {
            event_handler_1.default.one(this._element, EVENT_MOUSEUP_DISMISS, (event) => {
                if (event.target === this._element) {
                    this._ignoreBackdropClick = true;
                }
            });
        });
        this._showBackdrop(() => this._showElement(relatedTarget));
    }
    hide(event) {
        if (event) {
            event.preventDefault();
        }
        if (!this._isShown || this._isTransitioning) {
            return;
        }
        const hideEvent = event_handler_1.default.trigger(this._element, EVENT_HIDE);
        if (hideEvent.defaultPrevented) {
            return;
        }
        this._isShown = false;
        const transition = this._element.classList.contains(CLASS_NAME_FADE);
        if (transition) {
            this._isTransitioning = true;
        }
        this._setEscapeEvent();
        this._setResizeEvent();
        event_handler_1.default.off(document, EVENT_FOCUSIN);
        this._element.classList.remove(CLASS_NAME_SHOW);
        event_handler_1.default.off(this._element, EVENT_CLICK_DISMISS);
        event_handler_1.default.off(this._dialog, EVENT_MOUSEDOWN_DISMISS);
        if (transition) {
            const transitionDuration = (0, index_1.getTransitionDurationFromElement)(this._element);
            event_handler_1.default.one(this._element, 'transitionend', (event) => this._hideModal(event));
            (0, index_1.emulateTransitionEnd)(this._element, transitionDuration);
        }
        else {
            this._hideModal();
        }
    }
    dispose() {
        [window, this._element, this._dialog].forEach((htmlElement) => event_handler_1.default.off(htmlElement, EVENT_KEY));
        super.dispose();
        /**
         * `document` has 2 events `EVENT_FOCUSIN` and `EVENT_CLICK_DATA_API`
         * Do not move `document` in `htmlElements` array
         * It will remove `EVENT_CLICK_DATA_API` event that should remain
         */
        event_handler_1.default.off(document, EVENT_FOCUSIN);
        this._config = null;
        this._dialog = null;
        this._backdrop = null;
        this._isShown = null;
        this._isBodyOverflowing = null;
        this._ignoreBackdropClick = null;
        this._isTransitioning = null;
        this._scrollbarWidth = null;
    }
    handleUpdate() {
        this._adjustDialog();
    }
    // Private
    _getConfig(config) {
        config = {
            ...Default,
            ...manipulator_1.default.getDataAttributes(this._element),
            ...config,
        };
        (0, index_1.typeCheckConfig)(NAME, config, DefaultType);
        return config;
    }
    _showElement(relatedTarget) {
        const transition = this._element.classList.contains(CLASS_NAME_FADE);
        const modalBody = selector_engine_1.default.findOne(SELECTOR_MODAL_BODY, this._dialog);
        if (!this._element.parentNode || this._element.parentNode.nodeType !== Node.ELEMENT_NODE) {
            // Don't move modal's DOM position
            document.body.appendChild(this._element);
        }
        this._element.style.display = 'block';
        this._element.removeAttribute('aria-hidden');
        this._element.setAttribute('aria-modal', true);
        this._element.setAttribute('role', 'dialog');
        this._element.scrollTop = 0;
        if (modalBody) {
            modalBody.scrollTop = 0;
        }
        if (transition) {
            (0, index_1.reflow)(this._element);
        }
        this._element.classList.add(CLASS_NAME_SHOW);
        if (this._config.focus) {
            this._enforceFocus();
        }
        const transitionComplete = () => {
            if (this._config.focus) {
                this._element.focus();
            }
            this._isTransitioning = false;
            event_handler_1.default.trigger(this._element, EVENT_SHOWN, {
                relatedTarget,
            });
        };
        if (transition) {
            const transitionDuration = (0, index_1.getTransitionDurationFromElement)(this._dialog);
            event_handler_1.default.one(this._dialog, 'transitionend', transitionComplete);
            (0, index_1.emulateTransitionEnd)(this._dialog, transitionDuration);
        }
        else {
            transitionComplete();
        }
    }
    _enforceFocus() {
        event_handler_1.default.off(document, EVENT_FOCUSIN); // guard against infinite focus loop
        event_handler_1.default.on(document, EVENT_FOCUSIN, (event) => {
            if (document !== event.target &&
                this._element !== event.target &&
                !this._element.contains(event.target)) {
                this._element.focus();
            }
        });
    }
    _setEscapeEvent() {
        if (this._isShown) {
            event_handler_1.default.on(this._element, EVENT_KEYDOWN_DISMISS, (event) => {
                if (this._config.keyboard && event.key === ESCAPE_KEY) {
                    event.preventDefault();
                    this.hide();
                }
                else if (!this._config.keyboard && event.key === ESCAPE_KEY) {
                    this._triggerBackdropTransition();
                }
            });
        }
        else {
            event_handler_1.default.off(this._element, EVENT_KEYDOWN_DISMISS);
        }
    }
    _setResizeEvent() {
        if (this._isShown) {
            event_handler_1.default.on(window, EVENT_RESIZE, () => this._adjustDialog());
        }
        else {
            event_handler_1.default.off(window, EVENT_RESIZE);
        }
    }
    _hideModal() {
        this._element.style.display = 'none';
        this._element.setAttribute('aria-hidden', true);
        this._element.removeAttribute('aria-modal');
        this._element.removeAttribute('role');
        this._isTransitioning = false;
        this._showBackdrop(() => {
            document.body.classList.remove(CLASS_NAME_OPEN);
            this._resetAdjustments();
            this._resetScrollbar();
            event_handler_1.default.trigger(this._element, EVENT_HIDDEN);
        });
    }
    _removeBackdrop() {
        this._backdrop.parentNode.removeChild(this._backdrop);
        this._backdrop = null;
    }
    _showBackdrop(callback) {
        const animate = this._element.classList.contains(CLASS_NAME_FADE) ? CLASS_NAME_FADE : '';
        if (this._isShown && this._config.backdrop) {
            this._backdrop = document.createElement('div');
            this._backdrop.className = CLASS_NAME_BACKDROP;
            if (animate) {
                this._backdrop.classList.add(animate);
            }
            document.body.appendChild(this._backdrop);
            event_handler_1.default.on(this._element, EVENT_CLICK_DISMISS, (event) => {
                if (this._ignoreBackdropClick) {
                    this._ignoreBackdropClick = false;
                    return;
                }
                if (event.target !== event.currentTarget) {
                    return;
                }
                if (this._config.backdrop === 'static') {
                    this._triggerBackdropTransition();
                }
                else {
                    this.hide();
                }
            });
            if (animate) {
                (0, index_1.reflow)(this._backdrop);
            }
            this._backdrop.classList.add(CLASS_NAME_SHOW);
            if (!animate) {
                callback();
                return;
            }
            const backdropTransitionDuration = (0, index_1.getTransitionDurationFromElement)(this._backdrop);
            event_handler_1.default.one(this._backdrop, 'transitionend', callback);
            (0, index_1.emulateTransitionEnd)(this._backdrop, backdropTransitionDuration);
        }
        else if (!this._isShown && this._backdrop) {
            this._backdrop.classList.remove(CLASS_NAME_SHOW);
            const callbackRemove = () => {
                this._removeBackdrop();
                callback();
            };
            if (this._element.classList.contains(CLASS_NAME_FADE)) {
                const backdropTransitionDuration = (0, index_1.getTransitionDurationFromElement)(this._backdrop);
                event_handler_1.default.one(this._backdrop, 'transitionend', callbackRemove);
                (0, index_1.emulateTransitionEnd)(this._backdrop, backdropTransitionDuration);
            }
            else {
                callbackRemove();
            }
        }
        else {
            callback();
        }
    }
    _triggerBackdropTransition() {
        const hideEvent = event_handler_1.default.trigger(this._element, EVENT_HIDE_PREVENTED);
        if (hideEvent.defaultPrevented) {
            return;
        }
        const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
        if (!isModalOverflowing) {
            this._element.style.overflowY = 'hidden';
        }
        this._element.classList.add(CLASS_NAME_STATIC);
        const modalTransitionDuration = (0, index_1.getTransitionDurationFromElement)(this._dialog);
        event_handler_1.default.off(this._element, 'transitionend');
        event_handler_1.default.one(this._element, 'transitionend', () => {
            this._element.classList.remove(CLASS_NAME_STATIC);
            if (!isModalOverflowing) {
                event_handler_1.default.one(this._element, 'transitionend', () => {
                    this._element.style.overflowY = '';
                });
                (0, index_1.emulateTransitionEnd)(this._element, modalTransitionDuration);
            }
        });
        (0, index_1.emulateTransitionEnd)(this._element, modalTransitionDuration);
        this._element.focus();
    }
    // ----------------------------------------------------------------------
    // the following methods are used to handle overflowing modals
    // ----------------------------------------------------------------------
    _adjustDialog() {
        const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
        if ((!this._isBodyOverflowing && isModalOverflowing && !index_1.isRTL) ||
            (this._isBodyOverflowing && !isModalOverflowing && index_1.isRTL)) {
            this._element.style.paddingLeft = `${this._scrollbarWidth}px`;
        }
        if ((this._isBodyOverflowing && !isModalOverflowing && !index_1.isRTL) ||
            (!this._isBodyOverflowing && isModalOverflowing && index_1.isRTL)) {
            this._element.style.paddingRight = `${this._scrollbarWidth}px`;
        }
    }
    _resetAdjustments() {
        this._element.style.paddingLeft = '';
        this._element.style.paddingRight = '';
    }
    _checkScrollbar() {
        const rect = document.body.getBoundingClientRect();
        this._isBodyOverflowing = Math.round(rect.left + rect.right) < window.innerWidth;
        this._scrollbarWidth = this._getScrollbarWidth();
    }
    _setScrollbar() {
        if (this._isBodyOverflowing) {
            this._setElementAttributes(SELECTOR_FIXED_CONTENT, 'paddingRight', (calculatedValue) => calculatedValue + this._scrollbarWidth);
            this._setElementAttributes(SELECTOR_STICKY_CONTENT, 'marginRight', (calculatedValue) => calculatedValue - this._scrollbarWidth);
            this._setElementAttributes('body', 'paddingRight', (calculatedValue) => calculatedValue + this._scrollbarWidth);
        }
        document.body.classList.add(CLASS_NAME_OPEN);
    }
    _setElementAttributes(selector, styleProp, callback) {
        selector_engine_1.default.find(selector).forEach((element) => {
            const actualValue = element.style[styleProp];
            const calculatedValue = window.getComputedStyle(element)[styleProp];
            manipulator_1.default.setDataAttribute(element, styleProp, actualValue);
            element.style[styleProp] = callback(Number.parseFloat(calculatedValue)) + 'px';
        });
    }
    _resetScrollbar() {
        this._resetElementAttributes(SELECTOR_FIXED_CONTENT, 'paddingRight');
        this._resetElementAttributes(SELECTOR_STICKY_CONTENT, 'marginRight');
        this._resetElementAttributes('body', 'paddingRight');
    }
    _resetElementAttributes(selector, styleProp) {
        selector_engine_1.default.find(selector).forEach((element) => {
            const value = manipulator_1.default.getDataAttribute(element, styleProp);
            if (typeof value === 'undefined' && element === document.body) {
                element.style[styleProp] = '';
            }
            else {
                manipulator_1.default.removeDataAttribute(element, styleProp);
                element.style[styleProp] = value;
            }
        });
    }
    _getScrollbarWidth() {
        // thx d.walsh
        const scrollDiv = document.createElement('div');
        scrollDiv.className = CLASS_NAME_SCROLLBAR_MEASURER;
        document.body.appendChild(scrollDiv);
        const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
        document.body.removeChild(scrollDiv);
        return scrollbarWidth;
    }
    // Static
    static jQueryInterface(config, relatedTarget) {
        return this.each(function () {
            let data = data_1.default.getData(this, DATA_KEY);
            const _config = {
                ...Default,
                ...manipulator_1.default.getDataAttributes(this),
                ...(typeof config === 'object' && config ? config : {}),
            };
            if (!data) {
                data = new Modal(this, _config);
            }
            if (typeof config === 'string') {
                if (typeof data[config] === 'undefined') {
                    throw new TypeError(`No method named "${config}"`);
                }
                data[config](relatedTarget);
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
    const target = (0, index_1.getElementFromSelector)(this);
    if (this.tagName === 'A' || this.tagName === 'AREA') {
        event.preventDefault();
    }
    event_handler_1.default.one(target, EVENT_SHOW, (showEvent) => {
        if (showEvent.defaultPrevented) {
            // only register focus restorer if modal will actually get shown
            return;
        }
        event_handler_1.default.one(target, EVENT_HIDDEN, () => {
            if ((0, index_1.isVisible)(this)) {
                this.focus();
            }
        });
    });
    let data = data_1.default.getData(target, DATA_KEY);
    if (!data) {
        const config = {
            ...manipulator_1.default.getDataAttributes(target),
            ...manipulator_1.default.getDataAttributes(this),
        };
        data = new Modal(target, config);
    }
    data.toggle(this);
});
/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .Modal to jQuery only if jQuery is present
 */
(0, index_1.defineJQueryPlugin)(NAME, Modal);
exports.default = Modal;
//# sourceMappingURL=modal.js.map