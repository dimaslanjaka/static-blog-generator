var fs = require('fs'),
  ini = require('ini');

var config = ini.parse(fs.readFileSync('./test.ini', 'utf-8'));

config.scope = 'local';
config.database.database = 'use_another_database';
config.paths.default.tmpdir = '/tmp';
delete config.paths.default.datadir;
config.paths.default.array.push('fourth value');

Object.keys(config).forEach((key) => {
  if (key.startsWith('submodule')) {
    const submodule = config[key];
    console.log(submodule);
  }
});

fs.writeFileSync('./config_modified.ini', ini.stringify(config));
