const prettier = require('prettier');
const { join } = require('path');
const { writeFileSync } = require('fs');

/** @type {prettier.Config} */
const config = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  bracketSameLine: true,
  bracketSpacing: true,
  semi: true,
  singleQuote: true,
  trailingComma: 'none',
  endOfLine: 'lf',
  quoteProps: 'as-needed',
  overrides: [
    {
      excludeFiles: ['*.min.js', '*.min.css', '*.min.html', '*.min.scss'],
      files: ['*.js', '*.css', '*.sass', '*.html', '*.md', '*.ts'],
      options: {
        semi: true
      }
    },
    {
      files: ['*.ejs', '*.html'],
      options: {
        parser: 'html'
      }
    }
  ]
};
writeFileSync(
  join(__dirname, '.prettierrc.json'),
  JSON.stringify(config, null, 2)
);
module.exports = config;
