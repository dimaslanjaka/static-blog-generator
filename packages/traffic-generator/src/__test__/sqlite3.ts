import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
sqlite3.verbose();
open({
  filename: path.join(process.cwd(), "/data/database.sqlite"),
  driver: sqlite3.cached.Database
}).then(async (db) => {

});
