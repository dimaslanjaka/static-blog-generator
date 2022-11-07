var Notifier = require('./Notifier');
var InstantIndexing = /** @class */ (function () {
    /**
     *
     * @param {import('./globals').Key} key
     */
    function InstantIndexing(key) {
        this.notifier = new Notifier(key);
    }
    return InstantIndexing;
}());
module.exports = InstantIndexing;
