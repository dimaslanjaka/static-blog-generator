process.env.DEBUG = 'sbg-server,sbg-api';

import SBGServer from './server';

// just test unit
// not for compile

const _server = new SBGServer();

_server.start();
