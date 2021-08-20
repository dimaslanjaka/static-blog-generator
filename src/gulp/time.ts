import fs from "fs";

/**
 * Current date time
 * @return string ex> '2012-11-04 14:55:45'
 */
export function now() {
  return new Date()
    .toISOString()
    .replace(/T/, " ") // replace T with a space
    .replace(/\..+/, ""); // delete the dot and everything after
}

/**
 * Transform `now shortcode` to current formatted time
 * @param file
 * @see {@link now}
 */
export function shortcodeNow(file) {
  if (!fs.lstatSync(file).isDirectory()) throw new Error("its a directory, not a file");
  const read = fs.readFileSync(file).toString();
  const replaceNow = read.replace(/<!-- now\(\) -->/gm, now());
  fs.writeFileSync(file, replaceNow);
}
