const Notifier = require('./Notifier')

class InstantIndexing {
    /**
     * @type {Notifier}
     */
    notifier
    /**
     *
     * @param {import('./globals').Key} key
     */
    constructor(key) {
        this.notifier = new Notifier(key)
    }
}

module.exports = InstantIndexing
