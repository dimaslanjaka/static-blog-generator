#!/usr/bin/env node

import spawner from "./node/spawner";
import { kill } from "./electron/kill";

spawner.spawn("npm", ["run", "dev:nodemon"]);
spawner.spawn("npm", ["run", "dev:electron"], function (child) {
  kill.pids.push(child.pid);
});
