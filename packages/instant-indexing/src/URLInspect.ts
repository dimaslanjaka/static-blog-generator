import { Auth, google } from 'googleapis'

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
    searchconsole.sites
        .get({ siteUrl: currentURL.origin + '/' })
        .then((result) => {
            console.log(result.data)
        })
})
