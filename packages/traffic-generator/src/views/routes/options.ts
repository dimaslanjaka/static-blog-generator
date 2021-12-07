import fs from "fs";
import path from "path";
import DBConstructor from "../../db";
import { DB_PROXIES_KEY } from "../../db/constant";
import proxyFile from "../../proxies/proxyFile";
// database folder
const dbf = path.join(process.cwd(), "databases");
// database class
const db = new DBConstructor(dbf);

let proxies = db.get(DB_PROXIES_KEY, []) as string[];
const textarea: HTMLTextAreaElement = document.querySelector("#proxies");
textarea.value = proxies.join("\n");
textarea.dispatchEvent(new Event("change"));
const formOpt: HTMLFormElement = document.querySelector("#form-options");
formOpt.onsubmit = function (e) {
  e.preventDefault();
  const formData = new FormData(document.querySelector("#form-options"));
  const proxiesValue = formData.get("proxies");
  const parse = proxyFile.parseProxyFromText(proxiesValue.toString());
  if (parse.length) {
    db.push(DB_PROXIES_KEY, parse);
    proxies = db.get(DB_PROXIES_KEY, []) as string[];
    textarea.value = proxies.join("\n");
    textarea.dispatchEvent(new Event("change"));
  }
};
