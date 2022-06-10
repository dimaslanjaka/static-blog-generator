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
var bluebird_1 = __importDefault(require("bluebird"));
var feed_1 = require("feed");
var gulp_1 = __importDefault(require("gulp"));
var moment_1 = __importDefault(require("moment"));
var cache_post_1 = require("../../node/cache-post");
var color_1 = __importDefault(require("../../node/color"));
var filemanager_1 = require("../../node/filemanager");
var ejs_1 = require("../../renderer/ejs");
var author_1 = require("../../renderer/ejs/helper/author");
var excerpt_1 = require("../../renderer/ejs/helper/excerpt");
var thumbnail_1 = require("../../renderer/ejs/helper/thumbnail");
var _config_1 = __importStar(require("../../types/_config"));
var utils_1 = require("../utils");
var logname = color_1.default['Fuzzy Wuzzy']('[feeds]');
var urlfor = ejs_1.helpers.url_for;
function generateFeeds() {
    return new bluebird_1.default(function (resolve) {
        // https://github.com/jpmonette/feed
        var feed = new feed_1.Feed({
            title: _config_1.default.title,
            description: (0, excerpt_1.excerpt)(_config_1.default),
            id: _config_1.default.url,
            link: _config_1.default.url,
            language: 'en',
            image: urlfor(_config_1.default.logo),
            favicon: urlfor(_config_1.default.favicon),
            copyright: 'All rights reserved ' +
                (0, moment_1.default)().format('YYYY') +
                ', ' +
                (0, author_1.author_name)(_config_1.default),
            updated: new Date(2013, 6, 14),
            generator: 'static blog generator',
            feedLinks: {
                json: urlfor('/feed.json'),
                atom: urlfor('/atom.xml')
            },
            author: {
                name: (0, author_1.author_name)(_config_1.default),
                email: (0, author_1.author_email)(_config_1.default),
                link: (0, author_1.author_link)(_config_1.default)
            }
        });
        (0, cache_post_1.getLatestPosts)('date', (0, cache_post_1.getAllPosts)().length).forEach(function (post) {
            try {
                var obj = {
                    title: post.metadata.title,
                    id: new URL(post.metadata.url).toString(),
                    link: new URL(post.metadata.url).toString(),
                    description: (0, excerpt_1.excerpt)(post.metadata),
                    author: [(0, author_1.author_object)(post.metadata)],
                    date: (0, moment_1.default)(post.metadata.date.toString()).toDate(),
                    image: (0, thumbnail_1.thumbnail)(post.metadata),
                    content: (0, excerpt_1.excerpt)(post.metadata)
                };
                if (_config_1.default.feed.content) {
                    obj.content = post.content;
                }
                var isImgValid = (0, utils_1.isValidHttpUrl)(String(obj.image));
                if (!isImgValid) {
                    if (String(obj.image).startsWith('/'))
                        obj.image = urlfor(String(obj.image));
                }
                isImgValid = (0, utils_1.isValidHttpUrl)(String(obj.image));
                if (isImgValid && typeof obj.image == 'string') {
                    obj.image = obj.image.replace(/[\u00A0-\u9999<>&]/g, function (i) {
                        return '&#' + i.charCodeAt(0) + ';';
                    });
                    feed.addItem(obj);
                }
                else {
                    console.log(logname, 'invalid image url', post.metadata.title, obj.image);
                }
            }
            catch (error) {
                console.log(logname, error.message, post.metadata.title);
            }
        });
        if (Array.isArray(_config_1.default.feed.type)) {
            _config_1.default.feed.type.forEach(function (feedtype, index) {
                var result;
                var ext;
                var is = {
                    atom: feedtype == 'atom',
                    rss: feedtype == 'rss2' || feedtype == 'rss',
                    json: feedtype == 'json'
                };
                try {
                    if (is.json) {
                        ext = '.json';
                        result = feed.json1();
                    }
                    if (is.rss || is.atom) {
                        ext = '.xml';
                        if (is.atom) {
                            result = feed.atom1();
                        }
                        else {
                            result = feed.rss2();
                        }
                    }
                    if (typeof result == 'string' && typeof ext == 'string') {
                        if (feedtype == 'rss2')
                            feedtype = 'rss';
                        var dest = (0, filemanager_1.join)(_config_1.post_generated_dir, feedtype + ext);
                        (0, filemanager_1.write)(dest, result).then(function (path) {
                            console.log(logname, 'generated', path);
                            if (index == _config_1.default.feed.type.length - 1)
                                resolve();
                        });
                    }
                }
                catch (error) {
                    console.log(logname, error.message);
                }
            });
        }
    });
}
gulp_1.default.task('generate:feeds', generateFeeds);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGUtZmVlZC5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy9ndWxwL3Rhc2tzL2dlbmVyYXRlLWZlZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHNEQUFnQztBQUNoQyw2QkFBa0M7QUFDbEMsOENBQXdCO0FBQ3hCLGtEQUE0QjtBQUM1QixvREFBb0U7QUFDcEUsMkRBQXFDO0FBQ3JDLHNEQUFxRDtBQUNyRCwwQ0FBNkM7QUFDN0MsMkRBSzBDO0FBQzFDLDZEQUE0RDtBQUM1RCxpRUFBZ0U7QUFDaEUsNkRBQWlFO0FBQ2pFLGtDQUEwQztBQUUxQyxJQUFNLE9BQU8sR0FBRyxlQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDaEQsSUFBTSxNQUFNLEdBQUcsYUFBTyxDQUFDLE9BQU8sQ0FBQztBQUUvQixTQUFTLGFBQWE7SUFDcEIsT0FBTyxJQUFJLGtCQUFRLENBQUMsVUFBQyxPQUFPO1FBQzFCLG9DQUFvQztRQUNwQyxJQUFNLElBQUksR0FBRyxJQUFJLFdBQUksQ0FBQztZQUNwQixLQUFLLEVBQUUsaUJBQU0sQ0FBQyxLQUFLO1lBQ25CLFdBQVcsRUFBRSxJQUFBLGlCQUFPLEVBQUMsaUJBQU0sQ0FBQztZQUM1QixFQUFFLEVBQUUsaUJBQU0sQ0FBQyxHQUFHO1lBQ2QsSUFBSSxFQUFFLGlCQUFNLENBQUMsR0FBRztZQUNoQixRQUFRLEVBQUUsSUFBSTtZQUNkLEtBQUssRUFBRSxNQUFNLENBQUMsaUJBQU0sQ0FBQyxJQUFJLENBQUM7WUFDMUIsT0FBTyxFQUFFLE1BQU0sQ0FBQyxpQkFBTSxDQUFDLE9BQU8sQ0FBQztZQUMvQixTQUFTLEVBQ1Asc0JBQXNCO2dCQUN0QixJQUFBLGdCQUFNLEdBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO2dCQUN2QixJQUFJO2dCQUNKLElBQUEsb0JBQVcsRUFBQyxpQkFBTSxDQUFDO1lBQ3JCLE9BQU8sRUFBRSxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUM5QixTQUFTLEVBQUUsdUJBQXVCO1lBQ2xDLFNBQVMsRUFBRTtnQkFDVCxJQUFJLEVBQUUsTUFBTSxDQUFDLFlBQVksQ0FBQztnQkFDMUIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUM7YUFDMUI7WUFDRCxNQUFNLEVBQUU7Z0JBQ04sSUFBSSxFQUFFLElBQUEsb0JBQVcsRUFBQyxpQkFBTSxDQUFDO2dCQUN6QixLQUFLLEVBQUUsSUFBQSxxQkFBWSxFQUFDLGlCQUFNLENBQUM7Z0JBQzNCLElBQUksRUFBRSxJQUFBLG9CQUFXLEVBQUMsaUJBQU0sQ0FBQzthQUMxQjtTQUNGLENBQUMsQ0FBQztRQUVILElBQUEsMkJBQWMsRUFBQyxNQUFNLEVBQUUsSUFBQSx3QkFBVyxHQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSTtZQUN4RCxJQUFJO2dCQUNGLElBQU0sR0FBRyxHQUFTO29CQUNoQixLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLO29CQUMxQixFQUFFLEVBQUUsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUU7b0JBQ3pDLElBQUksRUFBRSxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRTtvQkFDM0MsV0FBVyxFQUFFLElBQUEsaUJBQU8sRUFBQyxJQUFJLENBQUMsUUFBUSxDQUFDO29CQUNuQyxNQUFNLEVBQUUsQ0FBQyxJQUFBLHNCQUFhLEVBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUN0QyxJQUFJLEVBQUUsSUFBQSxnQkFBTSxFQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFO29CQUNwRCxLQUFLLEVBQUUsSUFBQSxxQkFBUyxFQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7b0JBQy9CLE9BQU8sRUFBRSxJQUFBLGlCQUFPLEVBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztpQkFDaEMsQ0FBQztnQkFDRixJQUFJLGlCQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtvQkFDdkIsR0FBRyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO2lCQUM1QjtnQkFDRCxJQUFJLFVBQVUsR0FBRyxJQUFBLHNCQUFjLEVBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNuRCxJQUFJLENBQUMsVUFBVSxFQUFFO29CQUNmLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDO3dCQUNuQyxHQUFHLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7aUJBQ3pDO2dCQUNELFVBQVUsR0FBRyxJQUFBLHNCQUFjLEVBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUMvQyxJQUFJLFVBQVUsSUFBSSxPQUFPLEdBQUcsQ0FBQyxLQUFLLElBQUksUUFBUSxFQUFFO29CQUM5QyxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLHFCQUFxQixFQUFFLFVBQVUsQ0FBQzt3QkFDOUQsT0FBTyxJQUFJLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7b0JBQ3RDLENBQUMsQ0FBQyxDQUFDO29CQUNILElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ25CO3FCQUFNO29CQUNMLE9BQU8sQ0FBQyxHQUFHLENBQ1QsT0FBTyxFQUNQLG1CQUFtQixFQUNuQixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFDbkIsR0FBRyxDQUFDLEtBQUssQ0FDVixDQUFDO2lCQUNIO2FBQ0Y7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDZCxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDMUQ7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxpQkFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNuQyxpQkFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsUUFBUSxFQUFFLEtBQUs7Z0JBQ3ZDLElBQUksTUFBYyxDQUFDO2dCQUNuQixJQUFJLEdBQVcsQ0FBQztnQkFDaEIsSUFBTSxFQUFFLEdBQUc7b0JBQ1QsSUFBSSxFQUFFLFFBQVEsSUFBSSxNQUFNO29CQUN4QixHQUFHLEVBQUUsUUFBUSxJQUFJLE1BQU0sSUFBSSxRQUFRLElBQUksS0FBSztvQkFDNUMsSUFBSSxFQUFFLFFBQVEsSUFBSSxNQUFNO2lCQUN6QixDQUFDO2dCQUNGLElBQUk7b0JBQ0YsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFFO3dCQUNYLEdBQUcsR0FBRyxPQUFPLENBQUM7d0JBQ2QsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztxQkFDdkI7b0JBQ0QsSUFBSSxFQUFFLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxJQUFJLEVBQUU7d0JBQ3JCLEdBQUcsR0FBRyxNQUFNLENBQUM7d0JBQ2IsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFFOzRCQUNYLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7eUJBQ3ZCOzZCQUFNOzRCQUNMLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7eUJBQ3RCO3FCQUNGO29CQUNELElBQUksT0FBTyxNQUFNLElBQUksUUFBUSxJQUFJLE9BQU8sR0FBRyxJQUFJLFFBQVEsRUFBRTt3QkFDdkQsSUFBSSxRQUFRLElBQUksTUFBTTs0QkFBRSxRQUFRLEdBQUcsS0FBSyxDQUFDO3dCQUN6QyxJQUFNLElBQUksR0FBRyxJQUFBLGtCQUFJLEVBQUMsNEJBQWtCLEVBQUUsUUFBUSxHQUFHLEdBQUcsQ0FBQyxDQUFDO3dCQUN0RCxJQUFBLG1CQUFLLEVBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLElBQUk7NEJBQzVCLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQzs0QkFDeEMsSUFBSSxLQUFLLElBQUksaUJBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDO2dDQUFFLE9BQU8sRUFBRSxDQUFDO3dCQUN0RCxDQUFDLENBQUMsQ0FBQztxQkFDSjtpQkFDRjtnQkFBQyxPQUFPLEtBQUssRUFBRTtvQkFDZCxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQ3JDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7U0FDSjtJQUNILENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELGNBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsYUFBYSxDQUFDLENBQUMifQ==