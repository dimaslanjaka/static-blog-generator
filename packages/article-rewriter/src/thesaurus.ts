import escapeStringRegexp from 'escape-string-regexp';
import lodash from 'lodash';

interface Thesaurus {
  [key: string]: string[];
}

export default async function thesaurus_main(text: string) {
  //let text = 'install and activate VSCode ESLint extension for auto Linter And Formatter';
  const { default: thesaurus }: { default: Thesaurus } = await import('./thesaurus-en.json', {
    assert: {
      type: 'json'
    }
  });
  Object.keys(thesaurus)
    // /\b(string)\b
    .map((str) => {
      return {
        regex: new RegExp('\\b(' + escapeStringRegexp(str) + ')\\b', 'i'),
        thesaurus: thesaurus[str]
      };
    })
    .forEach(({ regex, thesaurus }) => {
      const has = regex.test(text);
      if (has) {
        text = text.replace(regex, function (whole, match) {
          // console.log({ whole, match, thesaurus: lodash.sample(thesaurus) });
          return whole.replace(match, lodash.sample(thesaurus));
        });
      }
    });
  return text;
}
