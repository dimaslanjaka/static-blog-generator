const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const flowbite = require('flowbite');
const postcssimport = require('postcss-import');
const codemirror = require('codemirror');

/** @type {import('postcss-import').AtImportOptions} */
module.exports = {
  plugins: [
    'postcss-preset-env',
    postcssimport,
    'tailwindcss/nesting',
    tailwindcss,
    autoprefixer,
    flowbite,
    codemirror
  ]
};
