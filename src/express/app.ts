"use strict";
import createServer from "./app-server";
import { transformPostBody } from "../markdown/transformPosts";
import express, { Express } from "express";
import serveIndex from "serve-index";
import serveStatic from "serve-static";
import path from "path";
import { default as translateRouter } from "./routes/translate";
import request from "request";
import ngrok from "../ngrok";
import Storage from "../js/Storage";

let expressApp: Express;
const server = createServer(async (app) => {
  // serve static build/_posts
  transformPostBody("build/_posts");
  app.use("/", express.static("build/_posts"), serveIndex("build/_posts", { icons: true }));
  app.use(serveStatic(path.join(__dirname, "views")));
  app.use(serveStatic(path.resolve("node_modules")));

  app.use("/translate", translateRouter);
  app.get("/proxy", (req, res) => {
    // read query parameters
    const url = req.query["url"];
    // make request to IEX API and forward response
    if (url && url.length > 0) return request(url).pipe(res);
    res.json({ error: true, message: 'Query "url" required' });
  });
  expressApp = app;

  await ngrok(app.get("port")).then((url) => {
    // save ngrok url to storage
    new Storage().set("ngrok", url);
  });
});
export default server;
