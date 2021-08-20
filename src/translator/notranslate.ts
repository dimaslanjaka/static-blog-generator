import jsdom from "jsdom";
const { JSDOM } = jsdom;
export default function (html: string) {
  const dom = new JSDOM(html);
  const pretext: NodeListOf<Element> = dom.window.document.querySelectorAll("pre,code");
  pretext.forEach(function (el) {
    if (!el.classList.contains("notranslate")) {
      el.classList.add("notranslate");
    }
  });

  //return dom.serialize();
  return dom.window.document.body.innerHTML;
}
