const path = require('path');

module.exports = function (api) {
  api.cache(true);

  const presets = [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '14'
        }
      }
    ]
  ];

  const plugins = [];

  return {
    presets,
    plugins,
    extends: path.join(__dirname, '../../babel.config.js')
  };
};
