const Authenticator = require('./Authenticator.js')
const { google } = require('googleapis')

const _test1 = () =>
  Authenticator.authenticate().then((oAuth) => {
    const drive = google.drive({
      version: 'v3',
      auth: oAuth
    })
  })

Authenticator.localAuth()
