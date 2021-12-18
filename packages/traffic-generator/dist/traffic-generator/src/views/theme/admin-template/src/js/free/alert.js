"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../mdb/util/index");
const event_handler_1 = __importDefault(require("../mdb/dom/event-handler"));
const selector_engine_1 = __importDefault(require("../mdb/dom/selector-engine"));
const alert_1 = __importDefault(require("../bootstrap/mdb-prefix/alert"));
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */
const NAME = 'alert';
const DATA_KEY = `mdb.${NAME}`;
const EVENT_KEY = `.${DATA_KEY}`;
const EVENT_CLOSE_BS = 'close.bs.alert';
const EVENT_CLOSED_BS = 'closed.bs.alert';
const EVENT_CLOSE = `close${EVENT_KEY}`;
const EVENT_CLOSED = `closed${EVENT_KEY}`;
const SELECTOR_ALERT = '.alert';
class Alert extends alert_1.default {
    constructor(element, data = {}) {
        super(element, data);
        this._init();
    }
    dispose() {
        event_handler_1.default.off(this._element, EVENT_CLOSE_BS);
        event_handler_1.default.off(this._element, EVENT_CLOSED_BS);
        super.dispose();
    }
    // Getters
    static get NAME() {
        return NAME;
    }
    // Private
    _init() {
        this._bindCloseEvent();
        this._bindClosedEvent();
    }
    _bindCloseEvent() {
        event_handler_1.default.on(this._element, EVENT_CLOSE_BS, () => {
            event_handler_1.default.trigger(this._element, EVENT_CLOSE);
        });
    }
    _bindClosedEvent() {
        event_handler_1.default.on(this._element, EVENT_CLOSED_BS, () => {
            event_handler_1.default.trigger(this._element, EVENT_CLOSED);
        });
    }
}
/**
 * ------------------------------------------------------------------------
 * Data Api implementation - auto initialization
 * ------------------------------------------------------------------------
 */
selector_engine_1.default.find(SELECTOR_ALERT).forEach((el) => {
    let instance = Alert.getInstance(el);
    if (!instance) {
        instance = new Alert(el);
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
        $.fn[NAME] = Alert.jQueryInterface;
        $.fn[NAME].Constructor = Alert;
        $.fn[NAME].noConflict = () => {
            $.fn[NAME] = JQUERY_NO_CONFLICT;
            return Alert.jQueryInterface;
        };
    }
});
exports.default = Alert;
//# sourceMappingURL=alert.js.map