"use strict";
// hexo database manager
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HexoDB = void 0;
var fs_1 = require("fs");
var upath_1 = require("upath");
var filemanager_1 = require("../node/filemanager");
var JSON_1 = require("../node/JSON");
var permalink_1 = require("../parser/permalink");
var parsePost_1 = require("../parser/post/parsePost");
var excerpt_1 = require("../renderer/ejs/helper/excerpt");
var thumbnail_1 = require("../renderer/ejs/helper/thumbnail");
var _config_1 = __importDefault(require("../types/_config"));
var dbpath = (0, upath_1.join)(process.cwd(), 'db.json');
var parse = (0, JSON_1.json_decode)((0, fs_1.existsSync)(dbpath) ? (0, filemanager_1.read)(dbpath).toString() : '{}');
if (!parse.models)
    parse.models = {
        Post: [],
        Tag: [],
        PostTag: [],
        PostCategory: [],
        Asset: [],
        Page: [],
        Cache: [],
        Category: [],
        PostAsset: [],
        Data: []
    };
var HexoDB = /** @class */ (function () {
    function HexoDB() {
    }
    HexoDB.prototype.addPost = function (obj) {
        var perm = (0, permalink_1.parsePermalink)(obj);
        var post = {
            title: obj.metadata.title,
            date: String(obj.metadata.date || new Date()),
            _content: obj.body || obj.content || '',
            source: (function () {
                var noext = (0, upath_1.join)(_config_1.default.source_dir, '_posts', obj.metadata.permalink).replace(/.(md|html)$/, '');
                var fullpath = (0, upath_1.join)(process.cwd(), noext);
                if ((0, fs_1.existsSync)(fullpath + '.md'))
                    return noext + '.md';
                if ((0, fs_1.existsSync)(fullpath + '.html'))
                    return noext + '.html';
                if ((0, fs_1.existsSync)(fullpath + '.json'))
                    return noext + '.json';
                return noext;
            })(),
            raw: (0, parsePost_1.buildPost)(obj),
            //__permalink: perm,
            slug: (0, upath_1.basename)(perm).replace(/.(md|html)$/, ''),
            published: 'draft' in obj.metadata ? (obj.metadata.draft ? 1 : 0) : 1,
            updated: String(obj.metadata.updated || obj.metadata.date || new Date()),
            comments: 'comments' in obj.metadata ? (obj.metadata.comments ? 1 : 0) : 1,
            layout: obj.metadata.type || '',
            photos: [],
            link: '',
            _id: '',
            content: obj.body || obj.content || '',
            site: undefined,
            cover: (0, thumbnail_1.thumbnail)(obj.metadata),
            excerpt: (0, excerpt_1.excerpt)(obj.metadata),
            more: ''
        };
        if (!parse.models.Post.find(function (epost) {
            return epost.title === post.title;
        })) {
            parse.models.Post.push(post);
        }
    };
    HexoDB.prototype.get = function () {
        return parse;
    };
    HexoDB.prototype.save = function () {
        (0, filemanager_1.write)(dbpath, (0, JSON_1.json_encode)(parse, 2));
    };
    /**
     * dump
     */
    HexoDB.prototype.simplify = function () {
        return parse.models.Post.map(function (post) {
            post._content = '';
            post.content = '';
            post.raw = '';
        });
    };
    return HexoDB;
}());
exports.HexoDB = HexoDB;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGV4by5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy9kYi9oZXhvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx3QkFBd0I7Ozs7OztBQUV4Qix5QkFBZ0M7QUFDaEMsK0JBQXVDO0FBQ3ZDLG1EQUFrRDtBQUNsRCxxQ0FBd0Q7QUFDeEQsaURBQXFEO0FBQ3JELHNEQUE4RDtBQUM5RCwwREFBeUQ7QUFDekQsOERBQTZEO0FBQzdELDZEQUFzQztBQUd0QyxJQUFNLE1BQU0sR0FBRyxJQUFBLFlBQUksRUFBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDOUMsSUFBTSxLQUFLLEdBQUcsSUFBQSxrQkFBVyxFQUN2QixJQUFBLGVBQVUsRUFBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBQSxrQkFBSSxFQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQ3BELENBQUM7QUFDRixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU07SUFDZixLQUFLLENBQUMsTUFBTSxHQUFHO1FBQ2IsSUFBSSxFQUFFLEVBQUU7UUFDUixHQUFHLEVBQUUsRUFBRTtRQUNQLE9BQU8sRUFBRSxFQUFFO1FBQ1gsWUFBWSxFQUFFLEVBQUU7UUFDaEIsS0FBSyxFQUFFLEVBQUU7UUFDVCxJQUFJLEVBQUUsRUFBRTtRQUNSLEtBQUssRUFBRSxFQUFFO1FBQ1QsUUFBUSxFQUFFLEVBQUU7UUFDWixTQUFTLEVBQUUsRUFBRTtRQUNiLElBQUksRUFBRSxFQUFFO0tBQ1QsQ0FBQztBQUVKO0lBQUE7SUE0REEsQ0FBQztJQTNEQyx3QkFBTyxHQUFQLFVBQVEsR0FBWTtRQUNsQixJQUFNLElBQUksR0FBRyxJQUFBLDBCQUFjLEVBQUMsR0FBRyxDQUFDLENBQUM7UUFDakMsSUFBTSxJQUFJLEdBQWtCO1lBQzFCLEtBQUssRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUs7WUFDekIs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