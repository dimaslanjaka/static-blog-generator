'use strict';

var frontMatter = require('front-matter');
var fs = require('fs-extra');
var hexoPostParser = require('hexo-post-parser');
var moment = require('moment-timezone');
var sbgUtils = require('sbg-utility');
var path = require('upath');

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

var sbgUtils__namespace = /*#__PURE__*/_interopNamespaceDefault(sbgUtils);

const processingUpdate = {};
/**
 * update metadata.updated post
 * @returns
 */
async function updatePost(postPath, callback) {
    // immediately return without callback
    if (processingUpdate[postPath])
        return false;
    // add to index
    processingUpdate[postPath] = true;
    const config = sbgUtils__namespace.config.getConfig();
    const parse = await hexoPostParser.parsePost(postPath, {
        shortcodes: {
            youtube: true,
            css: true,
            include: true,
            link: true,
            now: true,
            script: true,
            text: true,
            codeblock: true
        },
        cache: false,
        config: config,
        formatDate: true,
        fix: true,
        sourceFile: postPath
    });
    if (parse && parse.metadata) {
        // update post updated date
        const oriUp = parse.metadata.updated;
        const oriPath = postPath;
        parse.metadata.updated = moment()
            .tz(config.timezone || 'UTC')
            .format();
        const post = frontMatter(fs.readFileSync(postPath, 'utf-8'));
        if ('updated' in post.attributes === false) {
            post.attributes.updated = parse.metadata.updated;
        }
        post.attributes.updated = parse.metadata.updated;
        post.attributes.date = parse.metadata.date;
        if ('modified' in parse.metadata) {
            post.attributes.modified = parse.metadata.modified;
        }
        // remove meta subtitle when description is same
        if (post.attributes.description &&
            post.attributes.subtitle &&
            post.attributes.description == post.attributes.subtitle) {
            delete post.attributes.subtitle;
        }
        // prepare rebuild post
        const rBuild = {
            metadata: post.attributes,
            body: post.body,
            rawbody: post.body,
            content: post.body,
            config: config
        };
        // update original source post after process ends
        const rebuild = hexoPostParser.buildPost(rBuild);
        //writefile(path.join(config.cwd, 'tmp/rebuild.md'), rebuild);
        sbgUtils.Logger.log('write to', sbgUtils__namespace.normalizePath(oriPath).replace(sbgUtils__namespace.normalizePath(config.cwd), ''), oriUp, '->', post.attributes.updated);
        await sbgUtils.writefile(oriPath, rebuild, { async: true }); // write original post
        const build = hexoPostParser.buildPost(parse);
        await sbgUtils.writefile(postPath, build, { async: true });
    }
    else {
        sbgUtils.Logger.log('cannot parse', postPath);
        sbgUtils.writefile(path.join(config.cwd, 'tmp/errors', updatePost.name, 'cannot-parse.log'), postPath, { append: true });
    }
    const hasError = typeof (parse && parse.metadata) === 'undefined';
    if (typeof callback === 'function')
        callback(hasError, postPath);
    // remove from index
    delete processingUpdate[postPath];
    return hasError;
}

exports.updatePost = updatePost;
