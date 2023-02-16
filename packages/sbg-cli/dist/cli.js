#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const git_command_helper_1 = require("git-command-helper");
const node_process_1 = require("node:process");
const readline = __importStar(require("node:readline/promises"));
const sbg_api_1 = require("sbg-api");
const sbg_server_1 = __importDefault(require("sbg-server"));
const upath_1 = __importDefault(require("upath"));
const yargs_1 = __importDefault(require("yargs"));
const env_1 = require("./env");
const api = (0, env_1.getApi)();
yargs_1.default
    .scriptName('sbg')
    .usage('usage: sbg <command>')
    .command('$0', 'the default command', () => {
    // console.log('default command');
}, () => {
    yargs_1.default.showHelp();
})
    .command('view', 'view all configurations', function () {
    console.log(env_1.rootColor, api.cwd);
    console.log('source post dir    ', `${env_1.rootColor}/${api.config.post_dir}`);
    console.log('source dir         ', `${env_1.rootColor}/${api.config.source_dir}`);
    console.log('generated post dir ', `${env_1.rootColor}/${api.config.source_dir}/_posts`);
}, function () {
    //
})
    .command('clean [key]', 'clean commands', function (yargs) {
    yargs.positional(`db`, {
        type: `string`,
        describe: `clean ${env_1.rootColor}/tmp`
    });
    yargs.positional(`post`, {
        type: `string`,
        describe: `clean ${env_1.rootColor}/${api.config.source_dir}/_posts`
    });
    yargs.positional(`archive`, {
        type: `string`,
        describe: `clean categories, tags, archives inside ${env_1.rootColor}/.deploy_${api.config.deploy.type || 'git'}`
    });
    yargs.positional(`all`, {
        type: `string`,
        describe: `clean categories, tags, archives, generated posts, caches`
    });
}, async function ({ key }) {
    if (!key) {
        const rl = readline.createInterface({ input: node_process_1.stdin, output: node_process_1.stdout });
        const answer = await rl.question('Clean all caches? y/yes/n/no: ');
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
    .command('post <key>', `operation inside ${env_1.rootColor}/${api.config.post_dir}`, function (yargs) {
    yargs.positional(`copy`, {
        type: `string`,
        describe: `copy ${env_1.rootColor}/${api.config.post_dir} to ${env_1.rootColor}/${api.config.source_dir}/_posts`
    });
    yargs.positional(`standalone`, {
        type: `string`,
        describe: `run all *.standalone.js inside ${env_1.rootColor}/${api.config.post_dir}`
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
    .command('generate <key>', `generate operation on ${env_1.rootColor}/${api.config.public_dir}`, function (yargs) {
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
        describe: `generate feed on ${env_1.rootColor}/${api.config.public_dir}`
    });
    yargs.positional(`sitemap`, {
        type: `string`,
        describe: `generate sitemap on ${env_1.rootColor}/${api.config.public_dir}`
    });
}, async function ({ key }) {
    switch (key) {
        case 'seo':
            await api.seo(upath_1.default.join(api.config.cwd, api.config.public_dir));
            break;
        case 'safelink':
            await api.safelink(upath_1.default.join(api.config.cwd, api.config.public_dir));
            break;
        case 'sitemap':
            if (!fs_extra_1.default.existsSync(upath_1.default.join(api.config.cwd, api.config.public_dir))) {
                console.log(`site not yet generated, please using 'sbg generate hexo' to generate site.`);
                return;
            }
            await sbg_api_1.sitemap.hexoGenerateSitemap(api.config);
            break;
        case 'hexo':
            console.log('generating site', api.cwd);
            await (0, git_command_helper_1.spawnAsync)('npx', ['hexo', 'generate'], { cwd: api.cwd, stdio: 'inherit', shell: true });
            break;
    }
})
    .command('deploy <key>', `operation inside ${env_1.rootColor}/.deploy_${api.config.deploy?.type || 'git'}`, function (yargs) {
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
            await api.seo(upath_1.default.join(api.config.cwd, `/.deploy_${api.config.deploy?.type || 'git'}`));
            break;
        case 'safelink':
            await api.safelink(upath_1.default.join(api.config.cwd, `/.deploy_${api.config.deploy?.type || 'git'}`));
            break;
        case 'copy':
            await api.deploy.copy();
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
    const serv = new sbg_server_1.default({ root: api.cwd, port: parseInt(String(p || port || 4000)) });
    serv.start();
})
    .help('help')
    .alias('help', 'h')
    .alias('help', '?')
    .wrap(null).argv;
//# sourceMappingURL=cli.js.map