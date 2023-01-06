import { JSDOM } from 'jsdom';

export default function (html: string) {
  const dom = new JSDOM(html);
  const pretext = dom.window.document.querySelectorAll('pre,code'); // NodeListOf<Element>
  pretext.forEach(function (el) {
    if (!el.classList.contains('notranslate')) el.classList.add('notranslate');
  });

  const content = dom.window.document.querySelector('body').innerHTML;
  dom.window.close();
  return content;
}
