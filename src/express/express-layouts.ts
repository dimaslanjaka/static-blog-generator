/*jslint sloppy:true indent:2 plusplus:true regexp:true*/

import * as fs from "fs";
import path from "path";
import { makeid } from "../js/utility";

const contentPattern = "&&<>&&";

function contentFor(contentName) {
  return contentPattern + contentName + contentPattern;
}

function parseContents(locals) {
  let name,
    i = 1,
    str = locals.body,
    regex = new RegExp("\n?" + contentPattern + ".+?" + contentPattern + "\n?", "g"),
    split = str.split(regex),
    matches = str.match(regex);

  locals.body = split[0];

  if (matches !== null) {
    matches.forEach(function (match) {
      name = match.split(contentPattern)[1];
      locals[name] = split[i];
      i++;
    });
  }
}

function parseScripts(locals) {
  const str = locals.body,
    regex = /<script[\s\S]*?>[\s\S]*?<\/script>/g;

  if (regex.test(str)) {
    locals.body = str.replace(regex, "");
    locals.script = str.match(regex).join("\n");
  }
  //console.log(locals);
}

function parseStyles(locals) {
  const str = locals.body,
    regex = /(?:\<style[\s\S]*?\>[\s\S]*?\<\/style\>)|(?:\<link[\s\S]*?\>(?:\<\/link\>)?)/g;

  if (regex.test(str)) {
    locals.body = str.replace(regex, "");
    locals.style = str.match(regex).join("\n");
  }
}

function parseMetas(locals) {
  var str = locals.body,
    regex = /\<meta[\s\S]*?\>/g;

  if (regex.test(str)) {
    locals.body = str.replace(regex, "");
    locals.meta = str.match(regex).join("\n");
  }
}

export default function (req, res, next) {
  if (!res.__render) res.__render = res.render;

  res.render = function (view, options, fn) {
    let layout,
      self = this,
      app = req.app,
      defaultLayout = app.get("layout");

    options = options || {};
    if (typeof options === "function") {
      fn = options;
      options = {};
    }

    if (options.layout === false || (options.layout || defaultLayout) === false) {
      res.__render.call(res, view, options, fn);
      return;
    }

    layout = options.layout || res.locals.layout || defaultLayout;
    if (layout === true || layout === undefined) {
      layout = "layout.ejs";
    }

    options.contentFor = contentFor;
    res.__render.call(res, view, options, function (err, str) {
      let l, locals;

      if (err) {
        return fn ? fn(err) : next(err);
      }

      locals = {
        body: str,
        defineContent: function (contentName) {
          // replace with default header if header not defined
          if (contentName == "header" && typeof locals[contentName] == "undefined") {
            locals[contentName] = fs.readFileSync(path.join(__dirname, "views/header.ejs"));
          }
          return locals[contentName] || "";
        },
      };
      for (l in options) {
        if (options.hasOwnProperty(l) && l !== "layout" && l !== "contentFor") {
          locals[l] = options[l];
        }
      }

      if (typeof locals.body !== "string") {
        res.__render.call(self, view, locals, fn);
        return;
      }

      if (
        options.extractScripts === true ||
        (options.extractScripts === undefined && app.get("layout extractScripts") === true)
      ) {
        locals.script = "";
        parseScripts(locals);
      }

      if (
        options.extractStyles === true ||
        (options.extractStyles === undefined && app.get("layout extractStyles") === true)
      ) {
        locals.style = "";
        parseStyles(locals);
      }

      if (
        options.extractMetas === true ||
        (options.extractMetas === undefined && app.get("layout extractMetas") === true)
      ) {
        locals.meta = "";
        parseMetas(locals);
      }

      parseContents(locals);
      res.__render.call(self, layout, locals, fn);
    });
  };
  next();
}
