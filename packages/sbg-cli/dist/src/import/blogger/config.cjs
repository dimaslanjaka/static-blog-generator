// sbg-cli v2.0.0 Copyright (c) 2024 Dimas Lanjaka <dimaslanjaka@gmail.com> (https://webmanajemen.com)
'use strict';

var upath = require('../../../_virtual/upath.cjs');

const entriesDir = upath.default.join(process.cwd(), 'tmp/sbg-cli/entries');

exports.entriesDir = entriesDir;
