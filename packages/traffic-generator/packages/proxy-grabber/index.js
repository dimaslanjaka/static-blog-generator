require('ts-node').register({ projectSearchDir: __dirname, project: 'tsconfig.json' });
//const proxyGrabber = require('./dist/traffic-generator/packages/proxy-grabber/src/index');

global.dbFolder = __dirname;
module.exports = require('./src/index');
module.exports.db = require('./src/db/construct');
