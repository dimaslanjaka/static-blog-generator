import * as gulp from "gulp";
import { join } from "path";
import { parsePost } from "./src/markdown/transformPosts";

//require("./src/gulp/compress");
const post = join(__dirname, "source/_posts/Chimeraland/Pets.md");
const parse = parsePost(post);
