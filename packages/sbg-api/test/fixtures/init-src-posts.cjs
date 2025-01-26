const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Modify _config.yml
const configPath = path.join(__dirname, '_config.base.yml');
const doc = yaml.load(fs.readFileSync(configPath, 'utf8'));
doc.post_dir = 'src-posts';
fs.writeFileSync(path.join(__dirname, '_config.yml'), yaml.dump(doc));
