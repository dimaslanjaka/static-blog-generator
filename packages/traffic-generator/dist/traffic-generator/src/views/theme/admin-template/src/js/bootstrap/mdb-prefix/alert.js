"use strict";
/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.0-beta2): alert.js
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
const base_component_1 = __importDefault(require("./base-component"));
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */
const NAME = 'alert';
const DATA_KEY = 'bs.alert';
const EVENT_KEY = `.${DATA_KEY}`;
const DATA_API_KEY = '.data-api';
const SELECTOR_DISMISS = '[data-mdb-dismiss="alert"]';
const EVENT_CLOSE = `close${EVENT_KEY}`;
const EVENT_CLOSED = `closed${EVENT_KEY}`;
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
const CLASS_NAME_ALERT = 'alert';
const CLASS_NAME_FADE = 'fade';
const CLASS_NAME_SHOW = 'show';
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */
class Alert extends base_component_1.default {
    // Getters
    static get DATA_KEY() {
        return DATA_KEY;
    }
    // Public
    close(element) {
        const rootElement = element ? this._getRootElement(element) : this._element;
        const customEvent = this._triggerCloseEvent(rootElement);
        if (customEvent === null || customEvent.defaultPrevented) {
            return;
        }
        this._removeElement(rootElement);
    }
    // Private
    _getRootElement(element) {
        return (0, index_1.getElementFromSelector)(element) || element.closest(`.${CLASS_NAME_ALERT}`);
    }
    _triggerCloseEvent(element) {
        return event_handler_1.default.trigger(element, EVENT_CLOSE);
    }
    _removeElement(element) {
        element.classList.remove(CLASS_NAME_SHOW);
        if (!element.classList.contains(CLASS_NAME_FADE)) {
            this._destroyElement(element);
            return;
        }
        const transitionDuration = (0, index_1.getTransitionDurationFromElement)(element);
        event_handler_1.default.one(element, 'transitionend', () => this._destroyElement(element));
        (0, index_1.emulateTransitionEnd)(element, transitionDuration);
    }
    _destroyElement(element) {
        if (element.parentNode) {
            element.parentNode.removeChild(element);
        }
        event_handler_1.default.trigger(element, EVENT_CLOSED);
    }
    // Static
    static jQueryInterface(config) {
        return this.each(function () {
            let data = data_1.default.getData(this, DATA_KEY);
            if (!data) {
                data = new Alert(this);
            }
            if (config === 'close') {
                data[config](this);
            }
        });
    }
    static handleDismiss(alertInstance) {
        return function (event) {
            if (event) {
                event.preventDefault();
            }
            alertInstance.close(this);
        };
    }
}
/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */
event_handler_1.default.on(document, EVENT_CLICK_DATA_API, SELECTOR_DISMISS, Alert.handleDismiss(new Alert()));
/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .Alert to jQuery only if jQuery is present
 */
(0, index_1.defineJQueryPlugin)(NAME, Alert);
exports.default = Alert;
//# sourceMappingURL=alert.js.map