const Notifier = require('./Notifier')
const axios = require('axios')
const request = require('request')
const { google, Auth } = require('googleapis')

class InstantIndexing {
    /**
     * @type {Notifier}
     */
    notifier
    key
    /**
     *
     * @param {import('./globals').Key} key
     */
    constructor(key) {
        this.key = key
        this.notifier = new Notifier(key)
    }

    /**
     * Update url from list of sitemap
     * @param {string} url Sitemap URL
     */
    scanSitemap(url) {
        const self = this
        axios.get(url).then((response) => {
            let list
            if (url.endsWith('.txt')) list = extractSitemapTXT(response.data)
            if (Array.isArray(list)) {
                const currentURL = new URL(
                    'https://www.webmanajemen.com/chimeraland/scenic-spots/'
                )
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
                const auth = new Auth.GoogleAuth({
                    keyFile: self.key.keyFile,
                    scopes: [
                        'https://www.googleapis.com/auth/webmasters',
                        'https://www.googleapis.com/auth/webmasters.readonly',
                    ],
                })

                auth.getClient().then((client) => {
                    google.options({ auth: client })
                    const searchconsole = google.searchconsole({
                        version: 'v1',
                        auth: client,
                    })
                    const webmasters = google.webmasters('v3')
                    searchconsole.sites
                        .get({ siteUrl: currentURL.origin + '/' })
                        .then((result) => {
                            console.log(result.data)
                        })
                })
            }
        })
    }
}

/**
 *
 * @param {string} data
 */
function extractSitemapTXT(data) {
    return data.split(/\r?\n/g).filter((str) => str.trim().length > 0)
}

module.exports = InstantIndexing
