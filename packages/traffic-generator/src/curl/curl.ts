import { Curl } from "node-libcurl";
import path from "path";
import queryString from "querystring";
import * as fs from "fs";

// cURL instance
const curl = new Curl();
const close = curl.close.bind(curl);

// cURL Options
curl.setOpt(Curl.option.URL, ads[0]);
curl.setOpt(Curl.option.CONNECTTIMEOUT, 60);
curl.setOpt(Curl.option.FOLLOWLOCATION, true);
curl.setOpt(Curl.option.VERBOSE, true);

// cURL cookie settings
const cookieJarFile = path.join(__dirname, "/../../tmp/cookiejar.txt");
if (!fs.existsSync(path.dirname(cookieJarFile))) {
  fs.mkdirSync(path.dirname(cookieJarFile), { recursive: true });
}
curl.setOpt(Curl.option.COOKIEFILE, cookieJarFile);
curl.setOpt(Curl.option.COOKIEJAR, cookieJarFile);

// Cookie jar file check
if (!fs.existsSync(cookieJarFile)) {
  fs.writeFileSync(cookieJarFile, "");
}

// Event listener for data
curl.on("data", (chunk, curlInstance) => {
  console.log("Receiving data with size: ", chunk.length);
  console.log(chunk.toString());
});

// Event listener for end
curl.on("end", (statusCode, body, headers, curlInstance) => {
  //console.info("Status Code: ", statusCode);
  //console.info("Headers: ", headers);
  //console.info("Body length: ", body.length);
  console.info("Body: ", body);

  curl.close();
});

// Error handler for cURL
curl.on("error", (error, errorCode) => {
  console.error("Error: ", error);
  console.error("Code: ", errorCode);
  curl.close();
});

// Commits this request to the URL
curl.perform();
