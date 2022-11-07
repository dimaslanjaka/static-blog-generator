var _a = require('fs-extra'), readdirSync = _a.readdirSync, readFileSync = _a.readFileSync;
var join = require('upath').join;
var readDir = readdirSync(__dirname)
    .filter(function (str) { return str.endsWith('.json'); })
    .map(function (str) { return join(__dirname, str); });
var serviceConfig;
if (readDir.length > 0) {
    serviceConfig = JSON.parse(readFileSync(readDir[0], 'utf-8'));
}
module.exports = serviceConfig;
