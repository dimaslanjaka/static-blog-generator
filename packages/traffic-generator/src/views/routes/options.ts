import fs from "fs";
import path from "path";
import DBConstructor from "../../db";
import { DB_PROXIES_KEY, DB_SITES_KEY } from "../../db/constant";
import { siteOptionObject } from "../../electron-utils/webworker";
import proxyFile from "../../proxies/proxyFile";

// database folder
const dbf = path.join(process.cwd(), "databases");
// database class
const db = new DBConstructor(dbf);

// restore site options to wrapper
/**
 * Site options wrapper
 */
const sites = document.querySelector("div[sites]");
/**
 * save to memory default single site option
 */
const siteTemp = document.querySelector("div[site]");
let site: Element;
const sitesData: siteOptionObject[] = db.get(DB_SITES_KEY, []);
if (sitesData.length) {
  // delete default site option
  document.querySelectorAll("div[site]").forEach((SITE) => SITE.remove());
  // copy site option
  for (let index = 0; index < sitesData.length; index++) {
    const siteObj = sitesData[index];
    site = <HTMLInputElement>siteTemp.cloneNode(true);
    site
      .querySelectorAll("[name]")
      .forEach((elementNamed: HTMLInputElement) => {
        switch (elementNamed.getAttribute("name")) {
          case "opt[0][url]":
            elementNamed.value = siteObj.url;
            elementNamed.name = `opt[${index}][url]`;
            break;
          case "opt[0][proxy]":
            elementNamed.checked = siteObj.useProxy;
            elementNamed.name = `opt[${index}][proxy]`;
            break;
          case "opt[0][agent]":
            elementNamed.checked = siteObj.useAgent;
            elementNamed.name = `opt[${index}][agent]`;
            break;
          case "opt[0][cache]":
            elementNamed.checked = siteObj.useCache;
            elementNamed.name = `opt[${index}][cache]`;
            break;

          default:
            break;
        }
        elementNamed.dispatchEvent(new Event("change"));
      });

    // add suffix index label attribute for
    site.querySelectorAll("label").forEach((label) => {
      label.setAttribute("for", label.getAttribute("for") + index);
    });

    // add suffix index element attribute id
    site.querySelectorAll("[id]").forEach((elementId) => {
      elementId.id = elementId.id + index;
    });

    // append site option
    sites.appendChild(site);
  }
}

// restore proxies from database to textarea
let proxies = db.get(DB_PROXIES_KEY, []) as string[];
const textarea: HTMLTextAreaElement = document.querySelector("#proxies");
textarea.value = proxies.join("\n");
const counter = proxies.length > 0 ? proxies.length + " proxies" : "Proxies";
document.getElementById("proxy-counter").innerHTML = counter;
textarea.dispatchEvent(new Event("change"));

// handle option form
const formOpt: HTMLFormElement = document.querySelector("#form-options");
formOpt.onsubmit = function (e) {
  e.preventDefault();

  // parse proxies option
  const formData = new FormData(document.querySelector("#form-options"));
  const proxiesValue = formData.get("proxies");
  const parse = proxyFile.parseProxyFromText(proxiesValue.toString());
  if (parse.length) {
    db.push(DB_PROXIES_KEY, parse);
    proxies = db.get(DB_PROXIES_KEY, []) as string[];
    textarea.value = proxies.join("\n");
    textarea.dispatchEvent(new Event("change"));
  }

  // parse sites option
  const sitesObject: siteOptionObject[] = [];
  for (let index = 0; index < 2; index++) {
    const siteObject: siteOptionObject = {
      url: null,
      useProxy: false,
      useCache: false,
      useAgent: false
    };
    const urlData = formData.get(`opt[${index}][url]`);
    if (!urlData || urlData.length < 1) continue;
    siteObject.url = urlData.toString();
    siteObject.useProxy = formData.get(`opt[${index}][proxy]`) == "on";
    siteObject.useAgent = formData.get(`opt[${index}][agent]`) == "on";
    siteObject.useCache = formData.get(`opt[${index}][cache]`) == "on";
    sitesObject.push(siteObject);
    //console.log(urlData, siteObject);
  }

  // save to database
  db.push(DB_SITES_KEY, sitesObject);
  // notify ipcMain
  window.sendToElectron("reload-theme", sitesObject);
};

// handle dynamic sites form element
/**
 * Copy site option
 */
const copySite = () => {
  site = <Element>siteTemp.cloneNode(true);
  const count = sites.querySelectorAll("div[site]").length - 1;
  const index = count + 1;
  // replace index name [\d]
  site.querySelectorAll("[name]").forEach((named) => {
    let attrName = named.getAttribute("name");
    const regex = /\[(\d)\]/gm;
    attrName = attrName.replace(regex, `[${index}]`);
    named.setAttribute("name", attrName);
  });

  // add suffix index label attribute for
  site.querySelectorAll("label").forEach((label) => {
    label.setAttribute("for", label.getAttribute("for") + index);
  });

  // add suffix index element attribute id
  site.querySelectorAll("[id]").forEach((elementId) => {
    elementId.id = elementId.id + index;
  });

  sites.appendChild(site);
};
/**
 * Remove site option
 * @param el
 * @returns
 */
const removeSite = (el: HTMLElement | Element) => {
  if (sites.querySelectorAll("div[site]").length <= 1) return;
  el.closest("[site]").remove();
};
sites.addEventListener(
  "click",
  function (this: HTMLElement, e: MouseEvent) {
    const element = <Element>e.target;
    const parentHasAddOrRemove =
      element.parentElement.hasAttribute("add") ||
      element.parentElement.hasAttribute("remove");
    const hasAdd = element.hasAttribute("add");
    const hasRemove = element.hasAttribute("remove");
    // if icon clicked
    if (!hasAdd && !hasRemove && parentHasAddOrRemove) {
      if (element.classList.contains("far")) {
        if (element.classList.contains("fa-plus")) {
          copySite();
        } else if (element.classList.contains("fa-times")) {
          removeSite(element);
        }
      }
    } else {
      if (hasAdd) {
        copySite();
      } else if (hasRemove) {
        removeSite(element);
      }
    }
  },
  true
);
