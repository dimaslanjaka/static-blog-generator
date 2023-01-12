module.exports = {
  content: ['src/views/**/*.njk', 'src/public/**/*.js'],
  css: ['src/public/app.css'],
  extractors: [
    {
      extractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
      extensions: ['njk']
    }
  ]
};
