import { Auth, google } from 'googleapis'
import serViceConfig from './config'

const currentURL = new URL(
    'https://www.webmanajemen.com/chimeraland/scenic-spots/'
)

const auth = new Auth.GoogleAuth({
    keyFile: serViceConfig.keyFile,
    scopes: [
        'https://www.googleapis.com/auth/webmasters',
        'https://www.googleapis.com/auth/webmasters.readonly',
    ],
})

auth.getClient().then((client) => {
    google.options({ auth: client })
    auth.genera
})
