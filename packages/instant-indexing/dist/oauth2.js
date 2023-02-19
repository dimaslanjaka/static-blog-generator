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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var fs = require('fs');
var path = require('path');
var http = require('http');
var url = require('url');
var opn = require('open');
var destroyer = require('server-destroy');
var utility = require('sbg-utility');
var google = require('googleapis').google;
var people = google.people('v1');
var projectConfig = require('./config');
var axios = require('axios')["default"];
/**
 * To use OAuth2 authentication, we need access to a a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI.  To get these credentials for your application, visit https://console.cloud.google.com/apis/credentials.
 */
var keys = {
    redirect_uris: [process.env.GCALLBACK],
    client_id: process.env.GCLIENT,
    client_secret: process.env.GSECRET,
    service_email: process.env.GSERVICEMAIL,
    service_key: process.env.GSERVICEKEY
};
var TOKEN_PATH = path.join(process.cwd(), '.cache/token.json');
var scopes = [
    'https://www.googleapis.com/auth/user.emails.read',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/webmasters',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/webmasters.readonly',
    'https://www.googleapis.com/auth/indexing'
];
/**
 * Create a new OAuth2 client with the configured keys.
 */
var oauth2Client = new google.auth.OAuth2(keys.client_id, keys.client_secret, keys.redirect_uris[0]);
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
function saveCredentials(client) {
    var payload = JSON.stringify(Object.assign(client.credentials, {
        type: 'authorized_user',
        client_id: keys.client_id,
        client_secret: keys.client_secret,
        refresh_token: client.credentials.refresh_token
    }));
    utility.writefile(TOKEN_PATH, payload);
}
/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {import('googleapis').Auth.OAuth2Client | null}
 */
function loadSavedCredentialsIfExist() {
    try {
        var content = fs.readFileSync(TOKEN_PATH).toString();
        var credentials = JSON.parse(content);
        // const uri = 'https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=' + credentials.accestoken;
        return google.auth.fromJSON(credentials);
    }
    catch (err) {
        return null;
    }
}
/**
 * refresh access token
 * @returns {Promise<void>}
 */
function refreshToken() {
    return __awaiter(this, void 0, void 0, function () {
        var client, tokens;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, authenticate(scopes)];
                case 1:
                    client = _a.sent();
                    return [4 /*yield*/, client.refreshAccessToken()];
                case 2:
                    tokens = _a.sent();
                    saveCredentials(tokens);
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Check offline token is expired
 * @returns {Promise<boolean>}
 */
function checkTokenExpired() {
    return new Promise(function (resolve) {
        if (!fs.existsSync(TOKEN_PATH))
            return null;
        var content = fs.readFileSync(TOKEN_PATH).toString();
        var credentials = JSON.parse(content);
        var uri = 'https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=' + credentials.access_token;
        axios
            .get(uri)
            .then(function (response) {
            if (parseInt(response.data.expires_in) < 0) {
                resolve(true);
            }
            else {
                resolve(false);
            }
        })["catch"](function (e) {
            console.log(e.message);
            resolve(false);
        });
    });
}
/**
 * Open an http server to accept the oauth callback. In this simple example, the only request to our webserver is to /callback?code=<code>
 * @returns {Promise<import('googleapis').Auth.OAuth2Client>}
 */
function authenticate(scopes, rewrite) {
    if (rewrite === void 0) { rewrite = false; }
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    // authorize using local token
                    if (!rewrite) {
                        var client = loadSavedCredentialsIfExist();
                        if (client) {
                            return resolve(client);
                        }
                    }
                    // grab the url that will be used for authorization
                    var authorizeUrl = oauth2Client.generateAuthUrl({
                        access_type: 'offline',
                        scope: scopes.join(' ')
                    });
                    var server = http
                        .createServer(function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var qs_1, tokens, e_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    if (!(req.url.indexOf('/auth') > -1)) return [3 /*break*/, 2];
                                    qs_1 = new url.URL(req.url, 'http://localhost:4000').searchParams;
                                    res.end('Authentication successful! Please return to the console.');
                                    server.destroy();
                                    return [4 /*yield*/, oauth2Client.getToken(qs_1.get('code'))];
                                case 1:
                                    tokens = (_a.sent()).tokens;
                                    oauth2Client.credentials = tokens; // eslint-disable-line require-atomic-updates
                                    resolve(oauth2Client);
                                    _a.label = 2;
                                case 2: return [3 /*break*/, 4];
                                case 3:
                                    e_1 = _a.sent();
                                    reject(e_1);
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); })
                        .listen(4000, function () {
                        // open the browser to the authorize url to start the workflow
                        opn(authorizeUrl, { wait: false }).then(function (cp) { return cp.unref(); });
                    });
                    destroyer(server);
                })];
        });
    });
}
/**
 * Authorize with IAM Admin Email
 * @returns {Promise<import('googleapis').Auth.Compute>}
 */
function jwtAuthenticate() {
    return new Promise(function (resolve, reject) {
        projectConfig
            .getServiceAccount()
            .then(function (config) {
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
            authenticate(scopes).then(function (authClient) {
                var auth = new google.auth.GoogleAuth({
                    keyFile: config.path,
                    scopes: scopes,
                    authClient: authClient,
                    credentials: authClient.credentials
                });
                auth
                    .getClient()
                    .then(function (client) {
                    saveCredentials(client);
                    resolve(client);
                })["catch"](reject);
            });
        })["catch"](reject);
    });
}
function _getPeopleInfo() {
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, people.people.get({
                        resourceName: 'people/me',
                        personFields: 'emailAddresses'
                    })];
                case 1:
                    res = _a.sent();
                    console.log(res.data);
                    return [2 /*return*/];
            }
        });
    });
}
if (require.main === module)
    authenticate(scopes)
        .then(function (client) { return saveCredentials(client); })["catch"](console.error);
module.exports = {
    authenticate: authenticate,
    jwtAuthorize: jwtAuthenticate,
    scopes: scopes,
    saveCredentials: saveCredentials,
    loadSavedCredentialsIfExist: loadSavedCredentialsIfExist,
    checkTokenExpired: checkTokenExpired,
    refreshToken: refreshToken
};
