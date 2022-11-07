const path = require('path')
const { google } = require('googleapis')
const { authenticate } = require('@google-cloud/local-auth')
const { getApiConfig } = require('../src/config')

const webmasters = google.webmasters('v3')

async function runSample() {
    // Obtain user credentials to use for the request
    const auth = await authenticate({
        keyfilePath: getApiConfig().keyFile,
        scopes: [
            'https://www.googleapis.com/auth/webmasters',
            'https://www.googleapis.com/auth/webmasters.readonly',
        ],
    })
    google.options({ auth })

    const res = await webmasters.searchanalytics.query({
        siteUrl: 'https://www.webmanajemen.com/',
        requestBody: {
            startDate: '2018-01-01',
            endDate: '2018-04-01',
        },
    })
    console.log(res.data)
    return res.data
}

if (module === require.main) {
    runSample().catch(console.error)
}
module.exports = runSample
