var Notifier = require('./Notifier');
var axios = require('axios');
var InstantIndexing = /** @class */ (function () {
    /**
     *
     * @param {import('./globals').Key} key
     */
    function InstantIndexing(key) {
        this.key = key;
        this.notifier = new Notifier(key);
    }
    /**
     * Update url from list of sitemap
     * @param {string} url Sitemap URL
     */
    InstantIndexing.prototype.scanSitemap = function (url) {
        var self = this;
        axios.get(url).then(function (response) {
            var list;
            if (url.endsWith('.txt'))
                list = extractSitemapTXT(response.data);
            if (Array.isArray(list)) {
                // self.notifier.batch(list)
                /* self.notifier.jwtClient.authorize(function (err, tokens) {
                            if (!err) {
        
                                const options = {
                                    url: 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect',
                                    method: 'POST',
                                    // Your options, which must include the Content-Type and auth headers
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    auth: { bearer: tokens.access_token },
                                    // Define contents here. The structure of the content is described in the next step.
                                    json: {
                                        inspectionUrl: url.toString(),
                                        siteUrl: url.origin,
                                        languageCode: 'en',
                                    },
                                }
                                request(options, function (error, _response, body) {
                                    if (!error) {
                                        console.log(body)
                                    }
                                })
                            }
                        }) */
            }
        });
    };
    return InstantIndexing;
}());
/**
 *
 * @param {string} data
 */
function extractSitemapTXT(data) {
    return data.split(/\r?\n/g).filter(function (str) { return str.trim().length > 0; });
}
module.exports = InstantIndexing;
