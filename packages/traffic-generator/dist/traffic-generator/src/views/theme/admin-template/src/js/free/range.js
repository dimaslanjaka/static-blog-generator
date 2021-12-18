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
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */
const NAME = 'range';
const DATA_KEY = 'mdb.range';
const CLASSNAME_THUMB = 'thumb';
const CLASSNAME_WRAPPER = 'range';
const CLASSNAME_ACTIVE = 'thumb-active';
const CLASSNAME_THUMB_VALUE = 'thumb-value';
const SELECTOR_THUMB_VALUE = `.${CLASSNAME_THUMB_VALUE}`;
const SELECTOR_WRAPPER = `.${CLASSNAME_WRAPPER}`;
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */
class Range {
    constructor(element) {
        this._element = element;
        this._initiated = false;
        if (this._element) {
            data_1.default.setData(element, DATA_KEY, this);
            this.init();
        }
    }
    // Getters
    static get NAME() {
        return NAME;
    }
    get rangeInput() {
        return selector_engine_1.default.findOne('input[type=range]', this._element);
    }
    // Public
    init() {
        if (this._initiated) {
            return;
        }
        this._addThumb();
        this._updateValue();
        this._thumbPositionUpdate();
        this._handleEvents();
        this._initiated = true;
    }
    dispose() {
        this._disposeEvents();
        data_1.default.removeData(this._element, DATA_KEY);
        this._element = null;
    }
    // Private
    _addThumb() {
        const RANGE_THUMB = (0, index_1.element)('span');
        manipulator_1.default.addClass(RANGE_THUMB, CLASSNAME_THUMB);
        RANGE_THUMB.innerHTML = '<span class="thumb-value"></span>';
        this._element.append(RANGE_THUMB);
    }
    _updateValue() {
        const thumbValue = selector_engine_1.default.findOne(SELECTOR_THUMB_VALUE, this._element);
        thumbValue.textContent = this.rangeInput.value;
        this.rangeInput.oninput = () => (thumbValue.textContent = this.rangeInput.value);
    }
    _handleEvents() {
        event_handler_1.default.on(this.rangeInput, 'mousedown', () => this._showThumb());
        event_handler_1.default.on(this.rangeInput, 'mouseup', () => this._hideThumb());
        event_handler_1.default.on(this.rangeInput, 'touchstart', () => this._showThumb());
        event_handler_1.default.on(this.rangeInput, 'touchend', () => this._hideThumb());
        event_handler_1.default.on(this.rangeInput, 'input', () => this._thumbPositionUpdate());
    }
    _disposeEvents() {
        event_handler_1.default.off(this.rangeInput, 'mousedown', this._showThumb);
        event_handler_1.default.off(this.rangeInput, 'mouseup', this._hideThumb);
        event_handler_1.default.off(this.rangeInput, 'touchstart', this._showThumb);
        event_handler_1.default.off(this.rangeInput, 'touchend', this._hideThumb);
        event_handler_1.default.off(this.rangeInput, 'input', this._thumbPositionUpdate);
    }
    _showThumb() {
        manipulator_1.default.addClass(this._element.lastElementChild, CLASSNAME_ACTIVE);
    }
    _hideThumb() {
        manipulator_1.default.removeClass(this._element.lastElementChild, CLASSNAME_ACTIVE);
    }
    _thumbPositionUpdate() {
        const rangeInput = this.rangeInput;
        const inputValue = rangeInput.value;
        const minValue = rangeInput.min ? rangeInput.min : 0;
        const maxValue = rangeInput.max ? rangeInput.max : 100;
        const thumb = this._element.lastElementChild;
        const newValue = Number(((inputValue - minValue) * 100) / (maxValue - minValue));
        thumb.firstElementChild.textContent = inputValue;
        manipulator_1.default.style(thumb, { left: `calc(${newValue}% + (${8 - newValue * 0.15}px))` });
    }
    // Static
    static getInstance(element) {
        return data_1.default.getData(element, DATA_KEY);
    }
    static jQueryInterface(config, options) {
        return this.each(function () {
            let data = data_1.default.getData(this, DATA_KEY);
            const _config = typeof config === 'object' && config;
            if (!data && /dispose/.test(config)) {
                return;
            }
            if (!data) {
                data = new Range(this, _config);
            }
            if (typeof config === 'string') {
                if (typeof data[config] === 'undefined') {
                    throw new TypeError(`No method named "${config}"`);
                }
                data[config](options);
            }
        });
    }
}
// auto-init
selector_engine_1.default.find(SELECTOR_WRAPPER).map((element) => new Range(element));
// jQuery init
(0, index_1.onDOMContentLoaded)(() => {
    const $ = (0, index_1.getjQuery)();
    if ($) {
        const JQUERY_NO_CONFLICT = $.fn[NAME];
        $.fn[NAME] = Range.jQueryInterface;
        $.fn[NAME].Constructor = Range;
        $.fn[NAME].noConflict = () => {
            $.fn[NAME] = JQUERY_NO_CONFLICT;
            return Range.jQueryInterface;
        };
    }
});
exports.default = Range;
//# sourceMappingURL=range.js.map