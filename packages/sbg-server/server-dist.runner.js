require('dotenv').config();

process.cwd = () => __dirname + '/../../test';
const { server_runner } = require('server.runner');
const { SBGServer } = require('./dist/server');

// dev server
// just test unit
// not for compile

server_runner(SBGServer);
