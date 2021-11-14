// noinspection DuplicatedCode
"use strict";

/*!
 * Module dependencies
 */
import path from "path";
import express, { Express } from "express";
import responseTime from "response-time";
import responsePoweredBy from "./middleware/x-powered-by";
import http from "http";
import errorhandler from "errorhandler";
import expressLayouts from "./express-layouts";
import cors from "cors";
import { appRoot, port } from "../config";
import { PostDataTranslated } from "./types/request";
import * as fs from "fs";
import filemanager from "../node/filemanager";

// eslint-disable-next-line no-unused-vars
export default function (extendApp?: (instance: Express) => any) {
  const app = express();

  // Set express server port
  app.set("port", port);

  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(responsePoweredBy("L3n4r0x"));
  app.use(responseTime());

  // set views folder
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "hbs");

  // set layout configuration
  app.set("layout extractScripts", true);
  app.set("layout extractStyles", true);
  app.use(expressLayouts);

  // https://www.npmjs.com/package/cors#enabling-cors-pre-flight
  app.options("*", cors());

  app.post("/receiver", (req, res) => {
    const postData: undefined | PostDataTranslated = req.body;
    if (typeof postData != "undefined") {
      const translatedHtml = postData.html;
      const filepath = postData.path;
      /**
       * DO NOT WRITE TO THIS FILE
       */
      const fileSource = path.join(
        appRoot,
        "src-posts",
        decodeURI(new URL(filepath).pathname).replace(/\.html$/, ".md")
      );
      /**
       * WRITE TO THIS FILE INSTEAD
       */
      const fileTranslated = path.join(
        appRoot,
        "build/translated",
        postData.tl,
        decodeURI(new URL(filepath).pathname).replace(/\.html$/, ".md")
      );
      if (fs.existsSync(fileSource)) {
        filemanager.write(fileTranslated, translatedHtml);
      }
      return res.status(200).json({ error: false, message: "received successfully", postData: postData });
    }
    res.status(200).json({ error: true });
  });

  app.get("/clean", function (req, res) {
    // @todo remove posts build
    filemanager.rmdir(path.resolve("build/_posts"));
    filemanager.rmdir(path.resolve("build/translated"));
    res.send("built posts cleaned successfully");
  });

  app.use(errorhandler());

  const create = function (app: Express) {
    // Create http server and attach express app on it
    return http.createServer(app).listen(app.get("port"), "0.0.0.0", () => {
      console.log("Server started at http://localhost:" + app.get("port"));
    });
  };

  if (typeof extendApp == "function") {
    extendApp(app);
    return create(app);
  }
  return create(app);
}
