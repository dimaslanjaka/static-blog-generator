module.exports = {
  content: ['src/views/**/*.njk'],
  css: ['src/public/app.css'],
  extractors: [
    {
      extractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
      extensions: ['njk']
    }
  ]
};
