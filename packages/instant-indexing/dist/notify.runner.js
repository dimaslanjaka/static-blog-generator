"use strict";
exports.__esModule = true;
var notify_1 = require("./notify");
var oauth2_1 = require("./oauth2");
(0, oauth2_1.jwtAuthorize)().then(function (client) {
    (0, notify_1.notify2)('https://www.webmanajemen.com/chimeraland/monsters/cicada.html', 'URL_UPDATED', client.credentials);
});
