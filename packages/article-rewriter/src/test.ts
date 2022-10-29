import escapeStringRegexp from 'escape-string-regexp';
import thesaurus from './thesaurus-en.json' assert { type: 'json' };

const text = 'install and activate VSCode ESLint extension for auto Linter And Formatter';
Object.keys(thesaurus)
  .map((str) => new RegExp(escapeStringRegexp('\b' + str + '\b'), 'i'))
  .forEach((regex) => {
    const has = regex.test(text);
    console.log({ regex, has });
  });
