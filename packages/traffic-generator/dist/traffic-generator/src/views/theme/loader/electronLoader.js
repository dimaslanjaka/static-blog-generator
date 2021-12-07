"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ldLoader = void 0;
require("../../../../../hexo-seo/packages/js-prototypes/src/globals");
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
         * Activate single id (by id)
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
        this.loaders = dom.getElementsByClassName("ldld");
        console.log("found loaders", this.loaders.length);
    }
    /**
     * identify id for {@link ldloader.on} and {@link ldloader.off}
     * @param id
     * @param activate
     * @returns
     */
    identify(id, activate) {
        const self = this;
        if (typeof id == "string") {
            return this.single(id, activate);
        }
        else if (Array.isArray(id)) {
            return id.map((uid) => self.single(uid, activate));
        }
        else {
            return false;
        }
        return false;
    }
    /**
     * Trigger ALL for {@link ldloader.on} and {@link ldloader.off}
     * @param activate
     * @returns
     */
    all(activate) {
        const results = [];
        for (let index = 0; index < this.loaders.length; index++) {
            const element = this.loaders[index];
            results.push(this.trigger(element, activate));
        }
        return results;
    }
    /**
     * Activate
     * @param id select with custom id (multiple with array strings), null = all
     */
    on(id = null) {
        if (id) {
            return this.identify(id, true);
        }
        return this.all(true);
    }
    /**
     * Deactivate
     * @param id select with custom id (multiple with array strings), default null = all
     * @returns
     */
    off(id = null) {
        if (id) {
            return this.identify(id, true);
        }
        return this.all(false);
    }
}
exports.default = ldloader;
exports.ldLoader = ldloader;
//# sourceMappingURL=electronLoader.js.map