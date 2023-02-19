// Copyright 2012 Google LLC
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

import { default as axios } from 'axios';
import fs from 'fs';
import { google } from 'googleapis';
import http from 'http';
import opn from 'open';
import path from 'path';
import utility from 'sbg-utility';
import destroyer from 'server-destroy';
import url from 'url';
import * as projectConfig from './config';

/**
 * To use OAuth2 authentication, we need access to a a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI.  To get these credentials for your application, visit https://console.cloud.google.com/apis/credentials.
 */
const keys = {
  redirect_uris: [process.env.GCALLBACK],
  client_id: process.env.GCLIENT,
  client_secret: process.env.GSECRET,
  service_email: process.env.GSERVICEMAIL,
  service_key: process.env.GSERVICEKEY
};
const TOKEN_PATH = path.join(process.cwd(), '.cache/token.json');
const scopes = [
  'https://www.googleapis.com/auth/user.emails.read',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/webmasters',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/webmasters.readonly',
  'https://www.googleapis.com/auth/indexing'
];
global.scopes = scopes;

/**
 * Create a new OAuth2 client with the configured keys.
 */
const oauth2Client = new google.auth.OAuth2(keys.client_id, keys.client_secret, keys.redirect_uris[0]);

/**
 * This is one of the many ways you can configure googleapis to use authentication credentials.  In this method, we're setting a global reference for all APIs.  Any other API you use here, like google.drive('v3'), will now use this auth client. You can also override the auth client at the service and method call levels.
 */
google.options({ auth: oauth2Client });

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {import('googleapis').Auth.OAuth2Client | { credentials: Record<string,any> }} client
 * @return {void}
 */
function saveCredentials(client: import('googleapis').Auth.OAuth2Client | { credentials: Record<string, any> }): void {
  const payload = JSON.stringify(
    Object.assign(client.credentials, {
      type: 'authorized_user',
      client_id: keys.client_id,
      client_secret: keys.client_secret,
      refresh_token: client.credentials.refresh_token
    })
  );
  utility.writefile(TOKEN_PATH, payload);
}

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return
 */
export function loadSavedCredentialsIfExist() /*: import('googleapis').Auth.OAuth2Client | null*/ {
  try {
    const content = fs.readFileSync(TOKEN_PATH).toString();
    const credentials = JSON.parse(content);
    // const uri = 'https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=' + credentials.accestoken;
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * refresh access token
 * @returns
 */
export async function refreshToken() {
  const client = await authenticate(scopes);
  if (client['refreshAccessToken']) {
    const tokens = await client['refreshAccessToken']();
    saveCredentials(tokens);
  }
}

/**
 * Check offline token is expired
 * @returns {Promise<boolean>}
 */
export function checkTokenExpired(): Promise<boolean> {
  return new Promise((resolve) => {
    if (!fs.existsSync(TOKEN_PATH)) return null;
    const content = fs.readFileSync(TOKEN_PATH).toString();
    const credentials = JSON.parse(content);
    const uri = 'https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=' + credentials.access_token;
    axios
      .get(uri)
      .then((response) => {
        if (parseInt(response.data.expires_in) < 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch((e) => {
        console.log(e.message);
        resolve(false);
      });
  });
}

/**
 * Open an http server to accept the oauth callback. In this simple example, the only request to our webserver is to /callback?code=<code>
 * @returns
 */
export async function authenticate(scopes: string[], rewrite = false): Promise<import('googleapis').Auth.AuthClient> {
  return new Promise((resolve, reject) => {
    // authorize using local token
    if (!rewrite) {
      const client = loadSavedCredentialsIfExist();
      if (client) {
        return resolve(client);
      }
    }

    // grab the url that will be used for authorization
    const authorizeUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes.join(' ')
    });
    const server = http
      .createServer(async (req, res) => {
        try {
          if (req.url.indexOf('/auth') > -1) {
            const qs = new url.URL(req.url, 'http://localhost:4000').searchParams;
            res.end('Authentication successful! Please return to the console.');
            server.destroy();
            const { tokens } = await oauth2Client.getToken(qs.get('code'));
            oauth2Client.credentials = tokens; // eslint-disable-line require-atomic-updates
            resolve(oauth2Client);
          }
        } catch (e) {
          reject(e);
        }
      })
      .listen(4000, () => {
        // open the browser to the authorize url to start the workflow
        opn(authorizeUrl, { wait: false }).then((cp) => cp.unref());
      });
    destroyer(server);
  });
}

/**
 * Authorize with IAM Admin Email
 * @param scopes
 * @returns
 */
export function jwtAuthenticate(scopes: string[] = global.scopes): Promise<import('googleapis').Auth.AuthClient> {
  if (!scopes) scopes = global.scopes;
  return new Promise((resolve, reject) => {
    projectConfig
      .getServiceAccount()
      .then((config) => {
        /*const auth = new google.auth.GoogleAuth({
          keyFile: config.path,
          scopes
        });
        auth
          .getClient()
          .then((client) => {
            resolve(client);
          })
          .catch(reject);*/
        authenticate(scopes).then((authClient) => {
          const auth = new google.auth.GoogleAuth({
            keyFile: config.path,
            scopes,
            authClient,
            credentials: <any>authClient.credentials
          });
          auth
            .getClient()
            .then((client) => {
              saveCredentials(client);
              resolve(client);
            })
            .catch(reject);
        });
      })
      .catch(reject);
  });
}

export async function getPeopleInfo() {
  // retrieve user profile
  const people = google.people('v1');
  const res = await people.people.get({
    resourceName: 'people/me',
    personFields: 'emailAddresses'
  });
  return res.data;
}

if (require.main === module)
  authenticate(scopes)
    .then((client) => saveCredentials(client))
    .catch(console.error);
