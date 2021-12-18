"use strict";
/* eslint-disable */
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
const class_names_1 = __importStar(require("../lib/class-names"));
const update_geometry_1 = __importDefault(require("../update-geometry"));
function default_1(i) {
    bindMouseScrollHandler(i, [
        'containerWidth',
        'contentWidth',
        'pageX',
        'railXWidth',
        'scrollbarX',
        'scrollbarXWidth',
        'scrollLeft',
        'x',
        'scrollbarXRail',
    ]);
    bindMouseScrollHandler(i, [
        'containerHeight',
        'contentHeight',
        'pageY',
        'railYHeight',
        'scrollbarY',
        'scrollbarYHeight',
        'scrollTop',
        'y',
        'scrollbarYRail',
    ]);
}
exports.default = default_1;
function bindMouseScrollHandler(i, [containerHeight, contentHeight, pageY, railYHeight, scrollbarY, scrollbarYHeight, scrollTop, y, scrollbarYRail,]) {
    const element = i.element;
    let startingScrollTop = null;
    let startingMousePageY = null;
    let scrollBy = null;
    function mouseMoveHandler(e) {
        if (e.touches && e.touches[0]) {
            e[pageY] = e.touches[0].pageY;
        }
        element[scrollTop] = startingScrollTop + scrollBy * (e[pageY] - startingMousePageY);
        (0, class_names_1.addScrollingClass)(i, y);
        (0, update_geometry_1.default)(i);
        e.stopPropagation();
        e.preventDefault();
    }
    function mouseUpHandler() {
        (0, class_names_1.removeScrollingClass)(i, y);
        i[scrollbarYRail].classList.remove(class_names_1.default.state.clicking);
        i.event.unbind(i.ownerDocument, 'mousemove', mouseMoveHandler);
    }
    function bindMoves(e, touchMode) {
        startingScrollTop = element[scrollTop];
        if (touchMode && e.touches) {
            e[pageY] = e.touches[0].pageY;
        }
        startingMousePageY = e[pageY];
        scrollBy = (i[contentHeight] - i[containerHeight]) / (i[railYHeight] - i[scrollbarYHeight]);
        if (!touchMode) {
            i.event.bind(i.ownerDocument, 'mousemove', mouseMoveHandler);
            i.event.once(i.ownerDocument, 'mouseup', mouseUpHandler);
            e.preventDefault();
        }
        else {
            i.event.bind(i.ownerDocument, 'touchmove', mouseMoveHandler);
        }
        i[scrollbarYRail].classList.add(class_names_1.default.state.clicking);
        e.stopPropagation();
    }
    i.event.bind(i[scrollbarY], 'mousedown', (e) => {
        bindMoves(e);
    });
    i.event.bind(i[scrollbarY], 'touchstart', (e) => {
        bindMoves(e, true);
    });
}
//# sourceMappingURL=drag-thumb.js.map