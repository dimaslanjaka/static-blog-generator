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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPeopleInfo = exports.jwtAuthenticate = exports.googleAuthenticate = exports.checkTokenExpired = exports.refreshToken = exports.loadSavedCredentialsIfExist = exports.scopes = void 0;
var axios_1 = __importDefault(require("axios"));
var fs_1 = __importDefault(require("fs"));
var googleapis_1 = require("googleapis");
var http_1 = __importDefault(require("http"));
var open_1 = __importDefault(require("open"));
var path_1 = __importDefault(require("path"));
var sbg_utility_1 = __importDefault(require("sbg-utility"));
var server_destroy_1 = __importDefault(require("server-destroy"));
var url_1 = __importDefault(require("url"));
var projectConfig = __importStar(require("./config"));
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
var TOKEN_PATH = path_1.default.join(process.cwd(), '.cache/token.json');
exports.scopes = [
    'https://www.googleapis.com/auth/user.emails.read',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/webmasters',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/webmasters.readonly',
    'https://www.googleapis.com/auth/indexing'
];
global.scopes = exports.scopes;
/**
 * Create a new OAuth2 client with the configured keys.
 */
var oauth2Client = new googleapis_1.google.auth.OAuth2(keys.client_id, keys.client_secret, keys.redirect_uris[0]);
/**
 * This is one of the many ways you can configure googleapis to use authentication credentials.  In this method, we're setting a global reference for all APIs.  Any other API you use here, like google.drive('v3'), will now use this auth client. You can also override the auth client at the service and method call levels.
 */
googleapis_1.google.options({ auth: oauth2Client });
/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param client
 * @return
 */
function saveCredentials(client) {
    var payload = JSON.stringify(Object.assign(client.credentials, {
        type: 'authorized_user',
        client_id: keys.client_id,
        client_secret: keys.client_secret,
        refresh_token: client.credentials.refresh_token
    }));
    sbg_utility_1.default.writefile(TOKEN_PATH, payload);
}
/**
 * Reads previously authorized credentials from the save file.
 *
 * @return
 */
function loadSavedCredentialsIfExist() {
    try {
        var content = fs_1.default.readFileSync(TOKEN_PATH).toString();
        var credentials = JSON.parse(content);
        // const uri = 'https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=' + credentials.accestoken;
        return googleapis_1.google.auth.fromJSON(credentials);
    }
    catch (err) {
        return null;
    }
}
exports.loadSavedCredentialsIfExist = loadSavedCredentialsIfExist;
/**
 * refresh access token
 * @returns
 */
function refreshToken() {
    return __awaiter(this, void 0, void 0, function () {
        var client, credentials;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, googleAuthenticate(exports.scopes)];
                case 1:
                    client = _a.sent();
                    if (!client['refreshAccessToken']) return [3 /*break*/, 3];
                    return [4 /*yield*/, client['refreshAccessToken']()];
                case 2:
                    credentials = (_a.sent()).credentials;
                    oauth2Client.setCredentials(credentials);
                    saveCredentials(oauth2Client);
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.refreshToken = refreshToken;
/**
 * Check offline token is expired
 * @returns
 */
function checkTokenExpired() {
    return new Promise(function (resolve) {
        if (!fs_1.default.existsSync(TOKEN_PATH))
            return null;
        var content = fs_1.default.readFileSync(TOKEN_PATH).toString();
        var credentials = JSON.parse(content);
        var uri = 'https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=' + credentials.access_token;
        axios_1.default
            .get(uri)
            .then(function (response) {
            if (parseInt(response.data.expires_in) < 0) {
                resolve(true);
            }
            else {
                resolve(false);
            }
        })
            .catch(function (e) {
            console.log(e.message);
            resolve(false);
        });
    });
}
exports.checkTokenExpired = checkTokenExpired;
/**
 * Open an http server to accept the oauth callback. In this simple example, the only request to our webserver is to /callback?code=<code>
 * @returns
 */
function googleAuthenticate(scopes, rewrite) {
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
                    var server = http_1.default
                        .createServer(function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var qs_1, tokens, e_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    if (!(req.url.indexOf('/auth') > -1)) return [3 /*break*/, 2];
                                    qs_1 = new url_1.default.URL(req.url, 'http://localhost:4000').searchParams;
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
                        (0, open_1.default)(authorizeUrl, { wait: false }).then(function (cp) { return cp.unref(); });
                    });
                    (0, server_destroy_1.default)(server);
                })];
        });
    });
}
exports.googleAuthenticate = googleAuthenticate;
/**
 * Authorize with IAM Admin Email
 * @param scopes
 * @returns
 */
function jwtAuthenticate(scopes) {
    if (scopes === void 0) { scopes = global.scopes; }
    if (!scopes)
        scopes = global.scopes;
    return new Promise(function (resolve, reject) {
        projectConfig
            .getServiceAccount()
            .then(function (config) {
            googleAuthenticate(scopes).then(function (authClient) {
                var auth = new googleapis_1.google.auth.GoogleAuth({
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
                })
                    .catch(reject);
            });
        })
            .catch(reject);
    });
}
exports.jwtAuthenticate = jwtAuthenticate;
function getPeopleInfo() {
    return __awaiter(this, void 0, void 0, function () {
        var people, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    people = googleapis_1.google.people('v1');
                    return [4 /*yield*/, people.people.get({
                            resourceName: 'people/me',
                            personFields: 'emailAddresses'
                        })];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, res.data];
            }
        });
    });
}
exports.getPeopleInfo = getPeopleInfo;
if (require.main === module)
    googleAuthenticate(exports.scopes)
        .then(function (client) { return saveCredentials(client); })
        .catch(console.error);
//# sourceMappingURL=oauth2.js.map