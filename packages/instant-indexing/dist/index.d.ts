export = InstantIndexing;
declare class InstantIndexing {
    /**
     *
     * @param {import('./globals').Key} key
     */
    constructor(key: import('./globals').Key);
    /**
     * @type {Notifier}
     */
    notifier: Notifier;
}
import Notifier = require("./Notifier");
