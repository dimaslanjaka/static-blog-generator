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
require("detect-autofill");
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */
const NAME = 'input';
const DATA_KEY = 'mdb.input';
const CLASSNAME_WRAPPER = 'form-outline';
const CLASSNAME_ACTIVE = 'active';
const CLASSNAME_NOTCH = 'form-notch';
const CLASSNAME_NOTCH_LEADING = 'form-notch-leading';
const CLASSNAME_NOTCH_MIDDLE = 'form-notch-middle';
const CLASSNAME_NOTCH_TRAILING = 'form-notch-trailing';
const CLASSNAME_PLACEHOLDER_ACTIVE = 'placeholder-active';
const CLASSNAME_HELPER = 'form-helper';
const CLASSNAME_COUNTER = 'form-counter';
const SELECTOR_OUTLINE_INPUT = `.${CLASSNAME_WRAPPER} input`;
const SELECTOR_OUTLINE_TEXTAREA = `.${CLASSNAME_WRAPPER} textarea`;
const SELECTOR_NOTCH = `.${CLASSNAME_NOTCH}`;
const SELECTOR_NOTCH_LEADING = `.${CLASSNAME_NOTCH_LEADING}`;
const SELECTOR_NOTCH_MIDDLE = `.${CLASSNAME_NOTCH_MIDDLE}`;
const SELECTOR_HELPER = `.${CLASSNAME_HELPER}`;
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */
class Input {
    constructor(element) {
        this._element = element;
        this._label = null;
        this._labelWidth = 0;
        this._labelMarginLeft = 0;
        this._notchLeading = null;
        this._notchMiddle = null;
        this._notchTrailing = null;
        this._initiated = false;
        this._helper = null;
        this._counter = false;
        this._counterElement = null;
        this._maxLength = 0;
        this._leadingIcon = null;
        if (this._element) {
            data_1.default.setData(element, DATA_KEY, this);
            this.init();
        }
    }
    // Getters
    static get NAME() {
        return NAME;
    }
    get input() {
        const inputElement = selector_engine_1.default.findOne('input', this._element) ||
            selector_engine_1.default.findOne('textarea', this._element);
        return inputElement;
    }
    // Public
    init() {
        if (this._initiated) {
            return;
        }
        this._getLabelData();
        this._applyDivs();
        this._applyNotch();
        this._activate();
        this._getHelper();
        this._getCounter();
        this._initiated = true;
    }
    update() {
        this._getLabelData();
        this._getNotchData();
        this._applyNotch();
        this._activate();
        this._getHelper();
        this._getCounter();
    }
    forceActive() {
        manipulator_1.default.addClass(this.input, CLASSNAME_ACTIVE);
    }
    forceInactive() {
        manipulator_1.default.removeClass(this.input, CLASSNAME_ACTIVE);
    }
    dispose() {
        this._removeBorder();
        data_1.default.removeData(this._element, DATA_KEY);
        this._element = null;
    }
    // Private
    /*
    _getIcons() {
      this._leadingIcon = SelectorEngine.findOne('i.leading', this._element);
  
      if (this._leadingIcon !== null) {
        this._applyLeadingIcon();
      }
    }
  
    _applyLeadingIcon() {
      this._label.innerHTML = ` ${this._label.innerHTML}`;
      this._label.insertBefore(this._leadingIcon, this._label.firstChild);
    }
    */
    _getLabelData() {
        this._label = selector_engine_1.default.findOne('label', this._element);
        if (this._label === null) {
            this._showPlaceholder();
        }
        else {
            this._getLabelWidth();
            this._getLabelPositionInInputGroup();
        }
    }
    _getHelper() {
        this._helper = selector_engine_1.default.findOne(SELECTOR_HELPER, this._element);
    }
    _getCounter() {
        this._counter = manipulator_1.default.getDataAttribute(this.input, 'showcounter');
        if (this._counter) {
            this._maxLength = this.input.maxLength;
            this._showCounter();
        }
    }
    _showCounter() {
        this._counterElement = document.createElement('div');
        manipulator_1.default.addClass(this._counterElement, CLASSNAME_COUNTER);
        const actualLength = this.input.value.length;
        this._counterElement.innerHTML = `${actualLength} / ${this._maxLength}`;
        this._helper.appendChild(this._counterElement);
        this._bindCounter();
    }
    _bindCounter() {
        event_handler_1.default.on(this.input, 'input', () => {
            const actualLength = this.input.value.length;
            this._counterElement.innerHTML = `${actualLength} / ${this._maxLength}`;
        });
    }
    _showPlaceholder() {
        manipulator_1.default.addClass(this.input, CLASSNAME_PLACEHOLDER_ACTIVE);
    }
    _getNotchData() {
        this._notchMiddle = selector_engine_1.default.findOne(SELECTOR_NOTCH_MIDDLE, this._element);
        this._notchLeading = selector_engine_1.default.findOne(SELECTOR_NOTCH_LEADING, this._element);
    }
    _getLabelWidth() {
        this._labelWidth = this._label.clientWidth * 0.8 + 8;
    }
    _getLabelPositionInInputGroup() {
        this._labelMarginLeft = 0;
        if (!this._element.classList.contains('input-group'))
            return;
        const input = this.input;
        const prefix = selector_engine_1.default.prev(input, '.input-group-text')[0];
        if (prefix === undefined) {
            this._labelMarginLeft = 0;
        }
        else {
            this._labelMarginLeft = prefix.offsetWidth - 1;
        }
    }
    _applyDivs() {
        const notchWrapper = (0, index_1.element)('div');
        manipulator_1.default.addClass(notchWrapper, CLASSNAME_NOTCH);
        this._notchLeading = (0, index_1.element)('div');
        manipulator_1.default.addClass(this._notchLeading, CLASSNAME_NOTCH_LEADING);
        this._notchMiddle = (0, index_1.element)('div');
        manipulator_1.default.addClass(this._notchMiddle, CLASSNAME_NOTCH_MIDDLE);
        this._notchTrailing = (0, index_1.element)('div');
        manipulator_1.default.addClass(this._notchTrailing, CLASSNAME_NOTCH_TRAILING);
        notchWrapper.append(this._notchLeading);
        notchWrapper.append(this._notchMiddle);
        notchWrapper.append(this._notchTrailing);
        this._element.append(notchWrapper);
    }
    _applyNotch() {
        this._notchMiddle.style.width = `${this._labelWidth}px`;
        this._notchLeading.style.width = `${this._labelMarginLeft + 9}px`;
        if (this._label === null)
            return;
        this._label.style.marginLeft = `${this._labelMarginLeft}px`;
    }
    _removeBorder() {
        const border = selector_engine_1.default.findOne(SELECTOR_NOTCH, this._element);
        if (border)
            border.remove();
    }
    _activate(event) {
        (0, index_1.onDOMContentLoaded)(() => {
            this._getElements(event);
            const input = event ? event.target : this.input;
            if (input.value !== '') {
                manipulator_1.default.addClass(input, CLASSNAME_ACTIVE);
            }
        });
    }
    _getElements(event) {
        if (event) {
            this._element = event.target.parentNode;
            this._label = selector_engine_1.default.findOne('label', this._element);
        }
        if (event && this._label) {
            const prevLabelWidth = this._labelWidth;
            this._getLabelData();
            if (prevLabelWidth !== this._labelWidth) {
                this._notchMiddle = selector_engine_1.default.findOne('.form-notch-middle', event.target.parentNode);
                this._notchLeading = selector_engine_1.default.findOne(SELECTOR_NOTCH_LEADING, event.target.parentNode);
                this._applyNotch();
            }
        }
    }
    _deactivate(event) {
        const input = event ? event.target : this.input;
        if (input.value === '') {
            input.classList.remove(CLASSNAME_ACTIVE);
        }
    }
    static activate(instance) {
        return function (event) {
            instance._activate(event);
        };
    }
    static deactivate(instance) {
        return function (event) {
            instance._deactivate(event);
        };
    }
    static jQueryInterface(config, options) {
        return this.each(function () {
            let data = data_1.default.getData(this, DATA_KEY);
            const _config = typeof config === 'object' && config;
            if (!data && /dispose/.test(config)) {
                return;
            }
            if (!data) {
                data = new Input(this, _config);
            }
            if (typeof config === 'string') {
                if (typeof data[config] === 'undefined') {
                    throw new TypeError(`No method named "${config}"`);
                }
                data[config](options);
            }
        });
    }
    static getInstance(element) {
        return data_1.default.getData(element, DATA_KEY);
    }
}
event_handler_1.default.on(document, 'focus', SELECTOR_OUTLINE_INPUT, Input.activate(new Input()));
event_handler_1.default.on(document, 'input', SELECTOR_OUTLINE_INPUT, Input.activate(new Input()));
event_handler_1.default.on(document, 'blur', SELECTOR_OUTLINE_INPUT, Input.deactivate(new Input()));
event_handler_1.default.on(document, 'focus', SELECTOR_OUTLINE_TEXTAREA, Input.activate(new Input()));
event_handler_1.default.on(document, 'input', SELECTOR_OUTLINE_TEXTAREA, Input.activate(new Input()));
event_handler_1.default.on(document, 'blur', SELECTOR_OUTLINE_TEXTAREA, Input.deactivate(new Input()));
event_handler_1.default.on(window, 'shown.bs.modal', (e) => {
    selector_engine_1.default.find(SELECTOR_OUTLINE_INPUT, e.target).forEach((element) => {
        const instance = Input.getInstance(element.parentNode);
        if (!instance) {
            return;
        }
        instance.update();
    });
    selector_engine_1.default.find(SELECTOR_OUTLINE_TEXTAREA, e.target).forEach((element) => {
        const instance = Input.getInstance(element.parentNode);
        if (!instance) {
            return;
        }
        instance.update();
    });
});
event_handler_1.default.on(window, 'shown.bs.dropdown', (e) => {
    const target = e.target.parentNode.querySelector('.dropdown-menu');
    if (target) {
        selector_engine_1.default.find(SELECTOR_OUTLINE_INPUT, target).forEach((element) => {
            const instance = Input.getInstance(element.parentNode);
            if (!instance) {
                return;
            }
            instance.update();
        });
        selector_engine_1.default.find(SELECTOR_OUTLINE_TEXTAREA, target).forEach((element) => {
            const instance = Input.getInstance(element.parentNode);
            if (!instance) {
                return;
            }
            instance.update();
        });
    }
});
event_handler_1.default.on(window, 'shown.bs.tab', (e) => {
    const targetId = e.target.href.split('#')[1];
    const target = selector_engine_1.default.findOne(`#${targetId}`);
    selector_engine_1.default.find(SELECTOR_OUTLINE_INPUT, target).forEach((element) => {
        const instance = Input.getInstance(element.parentNode);
        if (!instance) {
            return;
        }
        instance.update();
    });
    selector_engine_1.default.find(SELECTOR_OUTLINE_TEXTAREA, target).forEach((element) => {
        const instance = Input.getInstance(element.parentNode);
        if (!instance) {
            return;
        }
        instance.update();
    });
});
// auto-init
selector_engine_1.default.find(`.${CLASSNAME_WRAPPER}`).map((element) => new Input(element));
// form reset handler
event_handler_1.default.on(window, 'reset', (e) => {
    selector_engine_1.default.find(SELECTOR_OUTLINE_INPUT, e.target).forEach((element) => {
        const instance = Input.getInstance(element.parentNode);
        if (!instance) {
            return;
        }
        instance.forceInactive();
    });
    selector_engine_1.default.find(SELECTOR_OUTLINE_TEXTAREA, e.target).forEach((element) => {
        const instance = Input.getInstance(element.parentNode);
        if (!instance) {
            return;
        }
        instance.forceInactive();
    });
});
// auto-fill
event_handler_1.default.on(window, 'onautocomplete', (e) => {
    const instance = Input.getInstance(e.target.parentNode);
    if (!instance || !e.cancelable) {
        return;
    }
    instance.forceActive();
});
(0, index_1.onDOMContentLoaded)(() => {
    const $ = (0, index_1.getjQuery)();
    if ($) {
        const JQUERY_NO_CONFLICT = $.fn[NAME];
        $.fn[NAME] = Input.jQueryInterface;
        $.fn[NAME].Constructor = Input;
        $.fn[NAME].noConflict = () => {
            $.fn[NAME] = JQUERY_NO_CONFLICT;
            return Input.jQueryInterface;
        };
    }
});
exports.default = Input;
//# sourceMappingURL=input.js.map