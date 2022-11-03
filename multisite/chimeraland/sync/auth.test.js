const Authenticator = require('./Authenticator.js')
const { google } = require('googleapis')

Authenticator.authenticate().then((oAuth) => {
  const drive = google.drive({
    version: 'v3',
    auth: oAuth
  })
})
