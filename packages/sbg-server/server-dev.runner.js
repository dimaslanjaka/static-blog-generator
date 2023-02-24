require('dotenv').config();
require('ts-node').register({ projectSearchDir: __dirname });

process.cwd = () => __dirname + '/../../test';
const { server_runner } = require('server.runner');
const { SBGServer } = require('./src/server');

// dev server
// just test unit
// not for compile

server_runner(SBGServer);
