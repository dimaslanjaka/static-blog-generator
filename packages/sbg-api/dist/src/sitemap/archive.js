'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var moment = require('moment');

function getCategoryTags(hexo) {
    const groups = ['categories', 'tags'];
    const locals = hexo.locals;
    const groupfilter = {
        tags: [],
        categories: []
    };
    if (!locals) {
        return groupfilter;
    }
    groups.map((group) => {
        const lastModifiedObject = locals.get(group).map((items) => {
            if (items.posts) {
                const archives = items;
                const posts = archives.posts;
                const latest = getLatestFromArrayDates(posts.map((post) => {
                    return post.updated?.toDate() || new Date();
                }));
                const permalink = new URL(hexo.config.url);
                permalink.pathname = archives.path;
                return {
                    permalink: permalink.toString(),
                    name: archives.name,
                    latest: moment(latest).format('YYYY-MM-DDTHH:mm:ssZ')
                };
            }
        });
        groupfilter[group] = lastModifiedObject;
    });
    return groupfilter;
}
/**
 * get latest date from array of date
 * @param arr
 * @returns
 */
function getLatestFromArrayDates(arr) {
    const dateMap = arr.map(function (e) {
        return e instanceof Date ? e : moment(e).toDate();
    });
    return new Date(Math.max.apply(null, dateMap.map((date) => date.getTime())));
}

exports.default = getCategoryTags;
exports.getLatestFromArrayDates = getLatestFromArrayDates;
