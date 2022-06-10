"use strict";
// hexo database manager
Object.defineProperty(exports, "__esModule", { value: true });
exports.HexoDB = exports.HexoDBPath = void 0;
var fs_1 = require("fs");
var upath_1 = require("upath");
var filemanager_1 = require("../node/filemanager");
var JSON_1 = require("../node/JSON");
var permalink_1 = require("../parser/permalink");
var parsePost_1 = require("../parser/post/parsePost");
var excerpt_1 = require("../renderer/ejs/helper/excerpt");
var thumbnail_1 = require("../renderer/ejs/helper/thumbnail");
exports.HexoDBPath = (0, upath_1.join)(process.cwd(), 'db.json');
var HexoDB = /** @class */ (function () {
    function HexoDB() {
        this.parse = {
            meta: {
                version: 0,
                warehouse: ''
            },
            models: {
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
            }
        };
        this.parse = (0, JSON_1.json_decode)((0, fs_1.existsSync)(exports.HexoDBPath) ? (0, filemanager_1.read)(exports.HexoDBPath).toString() : '{}');
    }
    HexoDB.prototype.addPost = function (obj) {
        var perm = (0, permalink_1.parsePermalink)(obj);
        var post = {
            title: obj.metadata.title,
            date: String(obj.metadata.date || new Date()),
            _content: obj.body || obj.content || '',
            source: '',
            raw: (0, parsePost_1.buildPost)(obj),
            slug: perm,
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
        if (!this.parse.models.Post.find(function (epost) {
            return epost.title === post.title;
        })) {
            this.parse.models.Post.push(post);
        }
    };
    HexoDB.prototype.get = function () {
        return this.parse;
    };
    HexoDB.prototype.save = function () {
        (0, filemanager_1.write)(exports.HexoDBPath, (0, JSON_1.json_encode)(this.parse, 2));
    };
    /**
     * dump
     */
    HexoDB.prototype.simplify = function () {
        return this.parse.models.Post.map(function (post) {
            post._content = '';
            post.content = '';
            post.raw = '';
        });
    };
    return HexoDB;
}());
exports.HexoDB = HexoDB;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGV4by5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy9kYi9oZXhvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx3QkFBd0I7OztBQUV4Qix5QkFBZ0M7QUFDaEMsK0JBQTZCO0FBQzdCLG1EQUFrRDtBQUNsRCxxQ0FBd0Q7QUFDeEQsaURBQXFEO0FBQ3JELHNEQUE4RDtBQUM5RCwwREFBeUQ7QUFDekQsOERBQTZEO0FBR2hELFFBQUEsVUFBVSxHQUFHLElBQUEsWUFBSSxFQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUN6RDtJQW1CRTtRQWxCQSxVQUFLLEdBQWU7WUFDbEIsSUFBSSxFQUFFO2dCQUNKLE9BQU8sRUFBRSxDQUFDO2dCQUNWLFNBQVMsRUFBRSxFQUFFO2FBQ2Q7WUFDRCxNQUFNLEVBQUU7Z0JBQ04sSUFBSSxFQUFFLEVBQUU7Z0JBQ1IsR0FBRyxFQUFFLEVBQUU7Z0JBQ1AsT0FBTyxFQUFFLEVBQUU7Z0JBQ1gsWUFBWSxFQUFFLEVBQUU7Z0JBQ2hCLEtBQUssRUFBRSxFQUFFO2dCQUNULElBQUksRUFBRSxFQUFFO2dCQUNSLEtBQUssRUFBRSxFQUFFO2dCQUNULFFBQVEsRUFBRSxFQUFFO2dCQUNaLFNBQVMsRUFBRSxFQUFFO2dCQUNiLElBQUksRUFBRSxFQUFFO2FBQ1Q7U0FDRixDQUFDO1FBRUEsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFBLGtCQUFXLEVBQ3RCLElBQUEsZUFBVSxFQUFDLGtCQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBQSxrQkFBSSxFQUFDLGtCQUFVLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUM1RCxDQUFDO0lBQ0osQ0FBQztJQUNELHdCQUFPLEdBQVAsVUFBUSxHQUFZO1FBQ2xCLElBQU0sSUFBSSxHQUFHLElBQUEsMEJBQWMsRUFBQyxHQUFHLENBQUMsQ0FBQztRQUNqQyxJQUFNLElBQUksR0FBUztZQUNq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