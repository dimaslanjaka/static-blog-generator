const fs = require('fs');
const path = require('path');

// cp _config.base.yml _config.yml
const configYml = path.join(__dirname, '_config.yml');
const baseConfig = path.join(__dirname, '_config.base.yml');
if (!fs.existsSync(configYml)) {
  fs.copyFileSync(baseConfig, configYml);
}
