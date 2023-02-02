#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const sbg_api_1 = require("sbg-api");
const upath_1 = __importDefault(require("upath"));
const yargs_1 = __importDefault(require("yargs"));
const api = new sbg_api_1.Application(process.cwd());
const rootColor = ansi_colors_1.default.bgYellowBright.black('<root>');
yargs_1.default
    .scriptName('sbg')
    .usage('usage: sbg <command>')
    .command('$0', 'the default command', () => {
    // console.log('default command');
}, () => {
    yargs_1.default.showHelp();
})
    .command('post <key>', `operation inside ${rootColor}/${api.config.post_dir}`, function (yargs) {
    yargs.positional(`copy`, {
        type: `string`,
        describe: `copy ${rootColor}/${api.config.post_dir} to ${rootColor}/${api.config.source_dir}/_posts`
    });
    yargs.positional(`standalone`, {
        type: `string`,
        describe: `run all *.standalone.js inside ${rootColor}/${api.config.post_dir}`
    });
}, async function ({ key }) {
    if (key) {
        if (key === 'copy') {
            await api.copy();
        }
        else if (key === 'standalone') {
            await api.standalone();
        }
    }
    else {
        yargs_1.default.showHelp();
    }
})
    .command('generate <key>', `operation inside ${rootColor}/${api.config.public_dir}`, function (yargs) {
    yargs.positional(`seo`, {
        type: `string`,
        describe: `fix seo`
    });
    yargs.positional(`safelink`, {
        type: `string`,
        describe: `anonymize external links`
    });
}, async function ({ key }) {
    if (key === 'seo') {
        await api.seo(upath_1.default.join(api.config.cwd, api.config.public_dir));
    }
    else if (key === 'safelink') {
        await api.safelink(upath_1.default.join(api.config.cwd, api.config.public_dir));
    }
})
    .command('deploy <key>', `operation inside ${rootColor}/.deploy_${api.config.deploy?.type || 'git'}`, function (yargs) {
    yargs.positional(`seo`, {
        type: `string`,
        describe: `fix seo`
    });
    yargs.positional(`safelink`, {
        type: `string`,
        describe: `anonymize external links`
    });
    yargs.positional(`copy`, {
        type: `string`,
        describe: `copy generated files to deployment directory`
    });
}, async function ({ key }) {
    if (key === 'seo') {
        await api.seo(upath_1.default.join(api.config.cwd, `/.deploy_${api.config.deploy?.type || 'git'}`));
    }
    else if (key === 'safelink') {
        await api.safelink(upath_1.default.join(api.config.cwd, `/.deploy_${api.config.deploy?.type || 'git'}`));
    }
    else if (key === 'copy') {
        //
    }
})
    .help('help')
    .alias('help', 'h')
    .alias('help', '?')
    .wrap(null).argv;
//# sourceMappingURL=cli.js.map