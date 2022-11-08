const { google } = require('googleapis')
const readline = require('readline')
const fs = require('fs')
const fsProm = fs.promises
const path = require('upath')
const open = require('open')
const globals = require('./_globals')

const CACHE_PATH = globals.getCacheDir()
const TOKEN_PATH = path.join(CACHE_PATH, '.token')

class Authenticator {
  /**
   *
   * @returns {Promise<import('googleapis').Auth.OAuth2Client>}
   * @example
   * Authenticator.authenticate().then((oAuth) => {
    const drive = google.drive({
      version: 'v3',
      auth: oAuth
    })
  })
   */
  static authenticate() {
    return new Promise((resolveAuth) => {
      const oauth2Client = new google.auth.OAuth2(
        '17772065749-bqi8lg8v5kovrp75ai0efa6m2rbimp9s.apps.googleusercontent.com',
        'lVdcPKrKwpJncleFI77URygS',
        'https://drivesync-223223.appspot.com/'
      )

      //ensure that always the latest tokens are stored in the cache
      oauth2Client.on('tokens', async (newTokens) => {
        //if no token is stored yet: return
        if (!fs.existsSync(TOKEN_PATH)) {
          return
        }

        let tokens = JSON.parse(await fsProm.readFile(TOKEN_PATH))
        tokens.access_token = newTokens.access_token

        if (newTokens.refresh_token) {
          tokens.refresh_token = newTokens.refresh_token
        }

        //save new tokens
        await fsProm.writeFile(TOKEN_PATH, JSON.stringify(tokens))
        console.log('Updated cached oAuth Tokens')
      })

      const tokens = async (resolve) => {
        //if token is already stored, use this one, otherwise ask for authorization to get a token
        if (fs.existsSync(TOKEN_PATH)) {
          let tokens = JSON.parse(await fsProm.readFile(TOKEN_PATH))
          resolve(tokens)
        } else {
          const url = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: 'https://www.googleapis.com/auth/drive', //all Drive Permissions
            prompt: 'consent'
          })

          console.log('Please open the following url in the browser: ' + url)
          open(url)

          const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
          })

          rl.question('Please enter the code: ', async (code) => {
            rl.close()

            let tokens = (await oauth2Client.getToken(code)).tokens
            //store the token in cache
            await fsProm.writeFile(TOKEN_PATH, JSON.stringify(tokens))

            resolve(tokens)
          })
        }
      }

      tokens(function (token) {
        oauth2Client.setCredentials(token)
        resolveAuth(oauth2Client)
      })
    })
  }
  /**
   * Auth using `@google-cloud/local-auth`
   * @returns
   */
  static async localAuth() {
    const { authenticate } = await import('@google-cloud/local-auth')
    const keyfilePath = [
      path.join(process.cwd(), 'google-api-key.json'),
      path.join(process.cwd(), 'google-api-keys.json')
    ].filter((loc) => fs.existsSync(loc))[0]
    if (!keyfilePath)
      throw new Error(
        'Google Api Key JSON not found. add google-api-key.json to your root project'
      )
    let keys = { redirect_uris: [''] }
    if (fs.existsSync(keyfilePath)) {
      const keyFile = require(keyfilePath)
      keys = keyFile.installed || keyFile.web
    }
    const redirectUri = keys.redirect_uris[keys.redirect_uris.length - 1]
    const oauth2Client = new google.auth.OAuth2(
      keys.client_id,
      keys.client_secret,
      redirectUri
    )

    //ensure that always the latest tokens are stored in the cache
    oauth2Client.on('tokens', async (newTokens) => {
      //if no token is stored yet: return
      if (!fs.existsSync(TOKEN_PATH)) {
        return
      }

      let tokens = JSON.parse(await fsProm.readFile(TOKEN_PATH))
      tokens.access_token = newTokens.access_token

      if (newTokens.refresh_token) {
        tokens.refresh_token = newTokens.refresh_token
      }

      //save new tokens
      await fsProm.writeFile(TOKEN_PATH, JSON.stringify(tokens))
      console.log('Updated cached oAuth Tokens')
    })

    if (fs.existsSync(TOKEN_PATH)) {
      /**
       * @type {import('googleapis').Auth.Credentials}
       */
      const tokens = JSON.parse(await fsProm.readFile(TOKEN_PATH))
      const tokenInfo = await oauth2Client.getTokenInfo(tokens.access_token)

      //console.log(tokenInfo.expiry_date)
      //console.log(Date.now())
      //console.log('DIFFERENT IN TIMES', tokenInfo.expiry_date , Date.now())
      if (tokenInfo.expiry_date > Date.now()) return oauth2Client
    }

    // resolve new tokens
    const localAuth = await authenticate({
      scopes: [
        'https://www.googleapis.com/auth/blogger',
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/youtube'
      ],
      keyfilePath
    })
    // console.log('Tokens:', localAuth.credentials)

    fs.writeFileSync(TOKEN_PATH, JSON.stringify(localAuth.credentials))
    oauth2Client.setCredentials(localAuth.credentials)
    return oauth2Client
  }
}

module.exports = Authenticator
