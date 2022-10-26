"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.safelinkProcess = void 0;
const fs_1 = require("fs");
const gulp_1 = __importDefault(require("gulp"));
const path_1 = require("path");
const safelinkify_1 = __importDefault(require("safelinkify"));
const through2_1 = __importDefault(require("through2"));
const deploy_1 = require("./deploy");
const gulp_config_1 = __importDefault(require("./gulp.config"));
const config = gulp_config_1.default;
const { deployDir } = (0, deploy_1.deployConfig)();
const configSafelink = Object.assign({ enable: false }, config.external_link.safelink);
const safelink = new safelinkify_1.default.safelink({
    // exclude patterns (dont anonymize these patterns)
    exclude: [
        ...config.external_link.exclude,
        /https?:\/\/?(?:([^*]+)\.)?webmanajemen\.com/,
        /([a-z0-9](?:[a-z0-9-]{1,61}[a-z0-9])?[.])*webmanajemen\.com/,
        new URL(config.url).host,
        'www.webmanajemen.com',
        'https://github.com/dimaslanjaka',
        'https://facebook.com/dimaslanjaka1',
        'dimaslanjaka.github.io',
        ...configSafelink.exclude
    ].filter(function (x, i, a) {
        // remove duplicate
        return a.indexOf(x) === i;
    }),
    redirect: [config.external_link.safelink.redirect, configSafelink.redirect],
    password: configSafelink.password || config.external_link.safelink.password,
    type: configSafelink.type || config.external_link.safelink.type
});
// safelinkify the deploy folder
gulp_1.default.task('safelink', safelinkProcess);
function safelinkProcess(_done) {
    return new Promise((resolve) => {
        gulp_1.default
            .src(['**/*.{html,htm}'], {
            cwd: deployDir,
            ignore: [
                // skip react project
                '**/chimeraland/{monsters,attendants,recipes,materials,scenic-spots}/**/*.html',
                '**/chimeraland/recipes.html',
                // skip tools
                '**/embed.html',
                '**/tools.html',
                '**/safelink.html'
            ]
        })
            .pipe(through2_1.default.obj((file, _enc, next) => __awaiter(this, void 0, void 0, function* () {
            // drop null
            if (file.isNull())
                return next();
            // do safelinkify
            const content = String(file.contents);
            const parsed = yield safelink.parse(content);
            if (parsed) {
                file.contents = Buffer.from(parsed);
                return next(null, file);
            }
            console.log('cannot parse', file.path);
            next();
        })))
            .pipe(gulp_1.default.dest(deployDir))
            .once('end', () => resolve(null));
    });
}
exports.safelinkProcess = safelinkProcess;
gulp_1.default.task('get-files', function () {
    const paths = new Set();
    return gulp_1.default
        .src(['**/*.{html,htm}'], {
        cwd: deployDir,
        ignore: [
            // skip react project
            '**/chimeraland/{monsters,attendants,recipes,materials,scenic-spots}/**/*.html',
            '**/chimeraland/recipes.html',
            // skip tools
            '**/embed.html',
            '**/tools.html',
            '**/safelink.html'
        ]
    })
        .pipe(through2_1.default.obj((file, _, next) => {
        if (/chimeraland/i.test(file.path)) {
            paths.add(file.path.replace(process.cwd(), ''));
        }
        next(null);
    }))
        .once('end', function () {
        (0, fs_1.writeFileSync)((0, path_1.join)(process.cwd(), 'tmp/debug.txt'), Array.from(paths.values()).join('\n'));
    });
});
