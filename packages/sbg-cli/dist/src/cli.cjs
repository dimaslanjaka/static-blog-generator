#!/usr/bin/env node
// sbg-cli v2.0.0 Copyright (c) 2024 Dimas Lanjaka <dimaslanjaka@gmail.com> (https://webmanajemen.com)
'use strict';

var fs = require('fs-extra');
var gitCommandHelper = require('git-command-helper');
var node_process = require('node:process');
var readline = require('node:readline');
var sbgApi = require('sbg-api');
var SBGServer = require('sbg-server');
var upath = require('../_virtual/upath.cjs');
var YARGS = require('yargs');
var env = require('./env.cjs');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var readline__namespace = /*#__PURE__*/_interopNamespaceDefault(readline);

/* eslint-disable @typescript-eslint/no-unused-expressions */
const api = env.getApi();
const yargs = YARGS(process.argv.slice(2));
yargs
    .scriptName('sbg')
    .usage('usage: sbg <command>')
    .command('$0', 'the default command', () => {
    // console.log('default command');
}, () => {
    yargs.showHelp();
})
    // view all configs command
    .command('view', 'view all configurations', function () {
    console.log(env.rootColor, api.cwd);
    console.log('source post dir    ', `${env.rootColor}/${api.config.post_dir}`);
    console.log('source dir         ', `${env.rootColor}/${api.config.source_dir}`);
    console.log('generated post dir ', `${env.rootColor}/${api.config.source_dir}/_posts`);
}, function () {
    //
})
    // clean commands
    .command('clean [key]', 'clean commands', function (yargs) {
    yargs.positional(`db`, {
        type: `string`,
        describe: `clean ${env.rootColor}/tmp`
    });
    yargs.positional(`post`, {
        type: `string`,
        describe: `clean ${env.rootColor}/${api.config.source_dir}/_posts`
    });
    yargs.positional(`archive`, {
        type: `string`,
        describe: `clean categories, tags, archives inside ${env.rootColor}/.deploy_${api.config.deploy.type || 'git'}`
    });
    yargs.positional(`all`, {
        type: `string`,
        describe: `clean categories, tags, archives, generated posts, caches`
    });
}, async function ({ key }) {
    if (!key) {
        const rl = readline__namespace.createInterface({ input: node_process.stdin, output: node_process.stdout });
        const answer = await new Promise((resolve) => {
            rl.question('Clean all caches? y/yes/n/no: ', (input) => {
                rl.close();
                resolve(input);
            });
        });
        if (answer === 'yes' || answer === 'y') {
            await api.clean('all');
        }
        else {
            console.log('clean aborted');
        }
        rl.close();
    }
    else {
        switch (key) {
            case 'db':
                await api.clean('database');
                break;
            case 'post':
                await api.clean('post');
                break;
            case 'archive':
                await api.clean('archive');
                break;
            case 'all':
                await api.clean('all');
                break;
        }
    }
})
    // process source posts
    .command('post <key>', `operation inside ${env.rootColor}/${api.config.post_dir}`, function (yargs) {
    yargs.positional(`copy`, {
        type: `string`,
        describe: `copy ${env.rootColor}/${api.config.post_dir} to ${env.rootColor}/${api.config.source_dir}/_posts`
    });
    yargs.positional(`standalone`, {
        type: `string`,
        describe: `run all *.standalone.js inside ${env.rootColor}/${api.config.post_dir}`
    });
    yargs.positional(`images`, {
        type: `string`,
        describe: `finding broken images inside ${env.rootColor}/${api.config.post_dir}`
    });
}, async function ({ key }) {
    if (key) {
        if (key === 'copy') {
            await api.copy();
        }
        else if (key === 'standalone') {
            await api.standalone();
        }
        else if (key === 'images') {
            await api.findBrokenImages();
        }
    }
    else {
        yargs.showHelp();
    }
})
    // process generated static html
    .command('generate <key>', `generate operation on ${env.rootColor}/${api.config.public_dir}`, function (yargs) {
    yargs.positional(`seo`, {
        type: `string`,
        describe: `fix seo after generate site`
    });
    yargs.positional(`safelink`, {
        type: `string`,
        describe: `anonymize external links after generate site`
    });
    yargs.positional(`hexo`, {
        type: `string`,
        describe: `generate site with hexo`
    });
    yargs.positional(`feed`, {
        type: `string`,
        describe: `generate feed on ${env.rootColor}/${api.config.public_dir}`
    });
    yargs.positional(`sitemap`, {
        type: `string`,
        describe: `generate sitemap on ${env.rootColor}/${api.config.public_dir}`
    });
}, async function ({ key }) {
    switch (key) {
        case 'seo':
            await api.seo(upath.default.join(api.config.cwd, api.config.public_dir));
            break;
        case 'safelink':
            await api.safelink(upath.default.join(api.config.cwd, api.config.public_dir));
            break;
        case 'feed':
            if (!fs.existsSync(upath.default.join(api.config.cwd, api.config.public_dir))) {
                console.log(`site not yet generated, please using 'sbg generate hexo' to generate site.`);
                return;
            }
            await sbgApi.feed.hexoGenerateFeed(undefined, api.config);
            break;
        case 'sitemap':
            if (!fs.existsSync(upath.default.join(api.config.cwd, api.config.public_dir))) {
                console.log(`site not yet generated, please using 'sbg generate hexo' to generate site.`);
                return;
            }
            await sbgApi.sitemap.hexoGenerateSitemap(api.config);
            break;
        case 'hexo':
            console.log('generating site', api.cwd);
            await gitCommandHelper.spawnAsync('npx', ['hexo', 'generate'], { cwd: api.cwd, stdio: 'inherit', shell: true });
            break;
    }
})
    // deployment
    .command('deploy <key>', `operation inside ${env.rootColor}/.deploy_${api.config.deploy?.type || 'git'}`, function (yargs) {
    yargs.positional(`seo`, {
        type: `string`,
        describe: `fix seo`
    });
    yargs.positional(`safelink`, {
        type: `string`,
        describe: `anonymize external links`
    });
    yargs.positional(`feed`, {
        type: `string`,
        describe: `generate feed`
    });
    yargs.positional(`sitemap`, {
        type: `string`,
        describe: `generate sitemap`
    });
    yargs.positional(`copy`, {
        type: `string`,
        describe: `copy generated files to deployment directory`
    });
}, async function ({ key }) {
    switch (key) {
        case 'seo':
            await api.seo(upath.default.join(api.config.cwd, `/.deploy_${api.config.deploy?.type || 'git'}`));
            break;
        case 'safelink':
            await api.safelink(upath.default.join(api.config.cwd, `/.deploy_${api.config.deploy?.type || 'git'}`));
            break;
        case 'copy':
            await api.deploy.copy({
                config: api.config,
                cwd: api.cwd
            });
            break;
    }
})
    .command('server', 'start server manager', function (yargs) {
    yargs.option('p', {
        alias: 'port',
        demandOption: true,
        default: 4000,
        describe: 'specify port, default 4000',
        type: 'number'
    }).argv;
}, function ({ p, port }) {
    const serv = new SBGServer({ root: api.cwd, port: parseInt(String(p || port || 4000)) });
    serv.start();
})
    .help('help')
    .alias('help', 'h')
    .alias('help', '?')
    .wrap(null).argv;
