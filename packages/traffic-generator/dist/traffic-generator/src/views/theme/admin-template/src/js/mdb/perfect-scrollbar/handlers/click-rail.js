"use strict";
/* eslint-disable */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const update_geometry_1 = __importDefault(require("../update-geometry"));
function default_1(i) {
    // const element = i.element;
    i.event.bind(i.scrollbarY, 'mousedown', (e) => e.stopPropagation());
    i.event.bind(i.scrollbarYRail, 'mousedown', (e) => {
        const positionTop = e.pageY - window.pageYOffset - i.scrollbarYRail.getBoundingClientRect().top;
        const direction = positionTop > i.scrollbarYTop ? 1 : -1;
        i.element.scrollTop += direction * i.containerHeight;
        (0, update_geometry_1.default)(i);
        e.stopPropagation();
    });
    i.event.bind(i.scrollbarX, 'mousedown', (e) => e.stopPropagation());
    i.event.bind(i.scrollbarXRail, 'mousedown', (e) => {
        const positionLeft = e.pageX - window.pageXOffset - i.scrollbarXRail.getBoundingClientRect().left;
        const direction = positionLeft > i.scrollbarXLeft ? 1 : -1;
        i.element.scrollLeft += direction * i.containerWidth;
        (0, update_geometry_1.default)(i);
        e.stopPropagation();
    });
}
exports.default = default_1;
//# sourceMappingURL=click-rail.js.map