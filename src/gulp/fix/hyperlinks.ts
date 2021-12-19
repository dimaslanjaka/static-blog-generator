// fix all hyperlinks endsWith .md
import * as fs from "fs";
const regex = /\[.*\]\(.*(.md)\)/gm;
/**
 * Replace hyperlinks endswith .md with .html
 * @param file
 * @returns
 */
export default function replaceMD2HTML(file: string) {
  if (!fs.statSync(file).isFile()) {
    console.log("[" + file.toString().replace(process.cwd(), "") + "] its a directory, not a file");
    return;
  }
  const read = fs.readFileSync(file).toString();
  if (regex.exec(read)) {
    const replace = read.replace(regex, function (wholeMatch, index1) {
      // act here or after the loop...
      //console.log(wholeMatch);
      return wholeMatch.replace(index1, ".html");
    });
    fs.writeFileSync(file, replace);
  }
}
