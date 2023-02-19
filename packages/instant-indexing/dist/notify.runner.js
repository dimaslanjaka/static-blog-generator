"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var notify_1 = require("./notify");
var oauth2_1 = require("./oauth2");
(0, oauth2_1.jwtAuthenticate)().then(function (client) {
    (0, notify_1.notify2)('https://www.webmanajemen.com/chimeraland/monsters/cicada.html', 'URL_UPDATED', client.credentials);
});
//# sourceMappingURL=notify.runner.js.map