"use strict";
/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.0-beta2): toast.js
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
const base_component_1 = __importDefault(require("./base-component"));
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */
const NAME = 'toast';
const DATA_KEY = 'bs.toast';
const EVENT_KEY = `.${DATA_KEY}`;
const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY}`;
const EVENT_HIDE = `hide${EVENT_KEY}`;
const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
const EVENT_SHOW = `show${EVENT_KEY}`;
const EVENT_SHOWN = `shown${EVENT_KEY}`;
const CLASS_NAME_FADE = 'fade';
const CLASS_NAME_HIDE = 'hide';
const CLASS_NAME_SHOW = 'show';
const CLASS_NAME_SHOWING = 'showing';
const DefaultType = {
    animation: 'boolean',
    autohide: 'boolean',
    delay: 'number',
};
const Default = {
    animation: true,
    autohide: true,
    delay: 5000,
};
const SELECTOR_DATA_DISMISS = '[data-bs-dismiss="toast"]';
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */
class Toast extends base_component_1.default {
    constructor(element, config) {
        super(element);
        this._config = this._getConfig(config);
        this._timeout = null;
        this._setListeners();
    }
    // Getters
    static get DefaultType() {
        return DefaultType;
    }
    static get Default() {
        return Default;
    }
    static get DATA_KEY() {
        return DATA_KEY;
    }
    // Public
    show() {
        const showEvent = event_handler_1.default.trigger(this._element, EVENT_SHOW);
        if (showEvent.defaultPrevented) {
            return;
        }
        this._clearTimeout();
        if (this._config.animation) {
            this._element.classList.add(CLASS_NAME_FADE);
        }
        const complete = () => {
            this._element.classList.remove(CLASS_NAME_SHOWING);
            this._element.classList.add(CLASS_NAME_SHOW);
            event_handler_1.default.trigger(this._element, EVENT_SHOWN);
            if (this._config.autohide) {
                this._timeout = setTimeout(() => {
                    this.hide();
                }, this._config.delay);
            }
        };
        this._element.classList.remove(CLASS_NAME_HIDE);
        (0, index_1.reflow)(this._element);
        this._element.classList.add(CLASS_NAME_SHOWING);
        if (this._config.animation) {
            const transitionDuration = (0, index_1.getTransitionDurationFromElement)(this._element);
            event_handler_1.default.one(this._element, 'transitionend', complete);
            (0, index_1.emulateTransitionEnd)(this._element, transitionDuration);
        }
        else {
            complete();
        }
    }
    hide() {
        if (!this._element.classList.contains(CLASS_NAME_SHOW)) {
            return;
        }
        const hideEvent = event_handler_1.default.trigger(this._element, EVENT_HIDE);
        if (hideEvent.defaultPrevented) {
            return;
        }
        const complete = () => {
            this._element.classList.add(CLASS_NAME_HIDE);
            event_handler_1.default.trigger(this._element, EVENT_HIDDEN);
        };
        this._element.classList.remove(CLASS_NAME_SHOW);
        if (this._config.animation) {
            const transitionDuration = (0, index_1.getTransitionDurationFromElement)(this._element);
            event_handler_1.default.one(this._element, 'transitionend', complete);
            (0, index_1.emulateTransitionEnd)(this._element, transitionDuration);
        }
        else {
            complete();
        }
    }
    dispose() {
        this._clearTimeout();
        if (this._element.classList.contains(CLASS_NAME_SHOW)) {
            this._element.classList.remove(CLASS_NAME_SHOW);
        }
        event_handler_1.default.off(this._element, EVENT_CLICK_DISMISS);
        super.dispose();
        this._config = null;
    }
    // Private
    _getConfig(config) {
        config = {
            ...Default,
            ...manipulator_1.default.getDataAttributes(this._element),
            ...(typeof config === 'object' && config ? config : {}),
        };
        (0, index_1.typeCheckConfig)(NAME, config, this.constructor.DefaultType);
        return config;
    }
    _setListeners() {
        event_handler_1.default.on(this._element, EVENT_CLICK_DISMISS, SELECTOR_DATA_DISMISS, () => this.hide());
    }
    _clearTimeout() {
        clearTimeout(this._timeout);
        this._timeout = null;
    }
    // Static
    static jQueryInterface(config) {
        return this.each(function () {
            let data = data_1.default.getData(this, DATA_KEY);
            const _config = typeof config === 'object' && config;
            if (!data) {
                data = new Toast(this, _config);
            }
            if (typeof config === 'string') {
                if (typeof data[config] === 'undefined') {
                    throw new TypeError(`No method named "${config}"`);
                }
                data[config](this);
            }
        });
    }
}
/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .Toast to jQuery only if jQuery is present
 */
(0, index_1.defineJQueryPlugin)(NAME, Toast);
exports.default = Toast;
//# sourceMappingURL=toast.js.map