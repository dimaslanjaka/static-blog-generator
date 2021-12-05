import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { curly } from "node-libcurl";
import path from "path";

const ads = ["https://adaway.org/hosts.txt"];

async function get(url: string) {
  const { statusCode, data, headers } = await curly.get(url);

  const _ref = data.replace(/#.*/g, "").split(/[\r\n]/);
  const _hosts: {
    host: string;
    domain: string;
  }[] = [];
  for (let _i = 0, _len = _ref.length; _i < _len; _i++) {
    const line = _ref[_i];
    const md = /(\d+\.\d+\.\d+\.\d+)\s+(.+)/.exec(line);
    if (md) {
      //obj[md[1]] = _.union(obj[md[1]] || [], md[2].trim().split(/\s+/));
      _hosts.push({
        host: md[1],
        domain: md[2]
      });
    }
  }
  return _hosts;
}
let hosts = [];

const adsx = ads.map((ad) => {
  return get(ad).then((arr) => {
    const arrays = arr.map((arr) => {
      return arr.domain;
    });
    hosts = hosts.concat(arrays);
    return hosts;
  });
});

const fileHosts = path.join(__dirname, "data/hosts.json");

adsx.map((adsx) => {
  if (!existsSync(path.dirname(fileHosts))) {
    mkdirSync(path.dirname(fileHosts));
  }
  writeFileSync(fileHosts, JSON.stringify(hosts));
});

export default function (): string[] {
  return JSON.parse(readFileSync(fileHosts).toString());
}
