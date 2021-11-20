import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { JSDOM } from "jsdom";
import { curly } from "node-libcurl";
import path from "path";

const url = "https://www.sslproxies.org/";

async function get(url: string): Promise<string> {
  const { statusCode, data, headers } = await curly.get(url);
  return data;
}
const jsonFile = path.join(__dirname, "data/sslproxies.json");
if (!existsSync(path.dirname(jsonFile))) {
  mkdirSync(path.dirname(jsonFile), { recursive: true });
}
get(url).then((response) => {
  const proxies: string[] = [];
  const dom = new JSDOM(response);
  const document = dom.window.document;
  const tr = document.querySelectorAll("tbody tr");
  tr.forEach((node) => {
    const td = node.querySelectorAll("td");
    const text = td[0].textContent + ":" + td[1].textContent;
    if (/^\d/g.test(text) && text.length > 2) {
      proxies.push(text);
    }
  });
  writeFileSync(jsonFile, JSON.stringify(proxies));
});
