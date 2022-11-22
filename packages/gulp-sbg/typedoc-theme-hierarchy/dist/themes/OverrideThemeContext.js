"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverrideThemeContext = void 0;
const typedoc_1 = require("typedoc");
const navigation_1 = require("../partials/navigation");
class OverrideThemeContext extends typedoc_1.DefaultThemeRenderContext {
    constructor(theme, options) {
        super(theme, options);
        this.navigation = (0, navigation_1.navigation)(this);
    }
}
exports.OverrideThemeContext = OverrideThemeContext;
