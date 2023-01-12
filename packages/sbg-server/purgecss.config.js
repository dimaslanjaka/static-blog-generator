module.exports = {
  content: ['src/views/**/*.njk'],
  css: ['public/app.css'],
  extractors: [
    {
      extractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
      extensions: ['html']
    }
  ]
};
