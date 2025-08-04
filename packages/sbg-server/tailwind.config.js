/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/views/**/*.njk',
    './src/views/**/*.html',
    './source/scripts/**/*.js',
    './node_modules/flowbite/**/*.js',
    './node_modules/codemirror/**/*.js'
  ],
  theme: {
    colors: {
      blue: '#1fb6ff',
      purple: '#7e5bef',
      pink: '#ff49db',
      orange: '#ff7849',
      green: '#13ce66',
      yellow: '#ffc82c',
      'gray-dark': '#273444',
      gray: '#8492a6',
      'gray-light': '#d3dce6'
    },
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif']
    },
    extend: {}
  },
  variants: {},
  plugins: [require('flowbite/plugin')]
};
