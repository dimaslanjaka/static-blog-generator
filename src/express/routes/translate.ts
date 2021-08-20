import express from "express";
import fs from "fs";
import filemanager from "../../node/filemanager";
import path from "path";
import url from "url";
import { appRoot } from "../../config";
import slash from "slash";
import { getNgrokUrl } from "../../ngrok";
import { URLParameter } from "../types/request";
import { parsePost } from "../../markdown/transformPosts";
import Translator from "../../translator";
import toHtml from "../../markdown/toHtml";
import notranslate from "../../translator/notranslate";

const router = express.Router();
// domain.com/translate
router.get("/", async function (req: URLParameter, res) {
  const index = [];
  const url_parts = url.parse(req.url, true);
  const query = url_parts.query;
  if (typeof query.url == "undefined") {
    //transformPostBody("build/_posts");
    const postsFolder = path.resolve("build/_posts");
    if (fs.existsSync(postsFolder)) {
      filemanager.readdir(postsFolder, function (err, results) {
        if (err) {
          console.error(err);
          res.status(404).send("404 not found");
        } else {
          // @todo build source post
          results.forEach((file) => {
            /**
             * Source post from src-posts/_posts
             */
            const sourcePost = path.join(
              process.cwd(),
              "src-posts",
              file.replace(path.join(process.cwd(), "build/_posts"), "").replace(/\.html$/, ".md")
            );
            //console.log(sourcePost, fs.existsSync(sourcePost));
            let sourceLang;
            if (fs.existsSync(sourcePost)) {
              const read = fs.readFileSync(sourcePost, { encoding: "utf-8" });
              const parse = parsePost(read);
              //console.log(parse.metadata);
              sourceLang = parse.metadata.lang;
              const describeMeta = `<div id="metadata"><h1 id="metadata-title">${parse.metadata.title}</h1><h2 id="metadata-subtitle">${parse.metadata.subtitle}</h2></div>`;
              const html = toHtml(parse.body);
              const filter_notranslate = notranslate(html);
              // write to build/_posts
              filemanager.write(file, `${describeMeta}<br/><br/>${filter_notranslate}`);
              //console.log(file + " written");
            }
            const canonical = slash(file.replace(path.join(appRoot, "build/_posts"), ""));
            const local = `${getNgrokUrl()}${canonical}`;
            index.push({
              local: local,
              lang: sourceLang,
            });
          });

          res.locals = {
            title: "Index Articles",
            message: "This is a index article lists",
          };
          res.render("translate-index.ejs", {
            data: index,
            ngrok_host: getNgrokUrl(),
          });
        }
      });
    }
  } else {
    // @todo translate based on url parameters
    const trans = new Translator(String(req.query["sl"] || "id"), String(req.query["tl"] || "en"));
    trans.try1(String(req.query["url"]), function (response) {
      trans.try2(response, function (response) {
        res.locals = {
          title: "Translated Successfully",
        };
        //res.send(trans.capture(trans.extractTranslated(response)));
        res.render("translate.ejs", { data: trans.extractTranslated(response) });
      });
    });
  }
});
router.get("/view", function (req, res) {
  const postsFolder = path.resolve("build/translated");
  if (fs.existsSync(postsFolder)) {
    res.locals = {
      title: "Translated Article",
    };
    const options = { langs: [], data: "" };
    // read folder only
    fs.readdir(postsFolder, {}, function (err, folders) {
      folders.forEach(function (folder) {
        options.langs.push(folder);
        const folderLang = path.resolve(postsFolder, folder);
        filemanager.readdir(folderLang, function (err, results) {
          results.forEach(function (result) {
            const pathname = result.replace(folderLang, "");
            console.log(pathname);
          });
        });
      });
    });
    res.render("translated.ejs", options);
  }
});

export default router;
