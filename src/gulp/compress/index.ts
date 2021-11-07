import yaml from "yaml";
import { readFileSync } from "fs";
import path from "path";

const root = path.join(__dirname, "../../../");
const config = yaml.parse(readFileSync(path.join(root, "_config.yml")).toString());
const public_dir = path.join(root, config.public_dir);
const source_dir = path.join(root, config.source_dir);
//console.log(config.public_dir, config.source_dir);
