"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ldLoader = void 0;
/**
 * Loading.io initializer
 */
class ldloader {
    constructor(opt) {
        /**
         * Direct trigger loader element
         * @param el Single DOM Element
         * @param activate true to activate
         * @returns
         */
        this.trigger = (el, activate) => {
            return el.classList.toggle("running", activate);
        };
        /**
         * Activate single id
         * @param id id element
         * @returns
         */
        this.single = (id, activate) => {
            const getid = document.querySelector("#" + id);
            if (getid)
                return this.trigger(getid, activate);
        };
        let dom = document;
        if (typeof opt == "object") {
            if (opt.root)
                dom = document.querySelector(opt.root);
        }
        this.loaders = dom.querySelectorAll(".ldld");
    }
    /**
     * Activate
     * @param id select with custom id (multiple with array strings), null = all
     */
    on(id = null) {
        const self = this;
        if (id) {
            if (typeof id == "string") {
                return this.single(id, true);
            }
            else if (Array.isArray(id)) {
                return id.map((uid) => self.single(uid, true));
            }
        }
        const results = [];
        this.loaders.forEach((el) => {
            results.push(self.trigger(el, true));
        });
        return results;
    }
    /**
     * Deactivate
     * @param id select with custom id (multiple with array strings), null = all
     * @returns
     */
    off(id) {
        const self = this;
        if (id) {
            if (typeof id == "string") {
                return this.single(id, false);
            }
            else if (Array.isArray(id)) {
                return id.map((uid) => self.single(uid, false));
            }
        }
    }
}
exports.default = ldloader;
exports.ldLoader = ldloader;
//# sourceMappingURL=electron.js.map