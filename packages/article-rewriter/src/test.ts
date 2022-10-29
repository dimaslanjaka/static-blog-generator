const text = 'install and activate VSCode ESLint extension for auto Linter And Formatter';
const base = 'https://api.funtranslations.com/translate/article_rewrite.json?text=';

const url = base + encodeURI(text);
axios.get(url);
