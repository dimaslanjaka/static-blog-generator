"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = exports.root = void 0;
var tslib_1 = require("tslib");
var xmlbuilder_1 = (0, tslib_1.__importDefault)(require("xmlbuilder"));
exports.root = {
    urlset: {
        "@xmlns": "http://www.sitemaps.org/schemas/sitemap/0.9",
        "@xmlns:news": "http://www.google.com/schemas/sitemap-news/0.9",
        url: [],
    },
};
var genres = ["Blog", "OpEd", "Opinion", "PressRelease", "Satire", "UserGenerated"];
function parse(prepare) {
    return {
        loc: prepare.loc,
        "news:news": {
            "news:publication": {
                "news:language": prepare.news.publication.language,
                "news:name": prepare.news.publication.name,
            },
            "news:title": prepare.news.title,
            "news:publication_date": prepare.news.publication_date,
        },
    };
}
exports.parse = parse;
var GoogleNewsSitemap = /** @class */ (function () {
    function GoogleNewsSitemap() {
        /**
         * Max 1000 items
         */
        this.items = [];
    }
    GoogleNewsSitemap.prototype.add = function (item) {
        if (!item.title && !item.publication_name && item.publication_date && !item.author)
            return;
        var author = typeof item.author == "string" ? item.author : item.author.name;
        var build = {
            loc: item.location,
            news: {
                publication: { name: author, language: item.publication_language },
                publication_date: item.publication_date,
                title: item.title,
                genres: item.genres || "Blog",
            },
        };
        this.items.push(build);
    };
    GoogleNewsSitemap.prototype.toString = function () {
        return xmlbuilder_1.default.create(exports.root, { version: "1.0", encoding: "UTF-8" }).end({ pretty: true });
    };
    return GoogleNewsSitemap;
}());
exports.default = GoogleNewsSitemap;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLHVFQUFvQztBQUd2QixRQUFBLElBQUksR0FBRztJQUNsQixNQUFNLEVBQUU7UUFDTixRQUFRLEVBQUUsNkNBQTZDO1FBQ3ZELGFBQWEsRUFBRSxnREFBZ0Q7UUFDL0QsR0FBRyxFQUFFLEVBQUU7S0FDUjtDQUNGLENBQUM7QUFHRixJQUFNLE1BQU0sR0FBRyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsZUFBZSxDQUFDLENBQUM7QUE4QnRGLFNBQWdCLEtBQUssQ0FBQyxPQUFpQjtJQUNyQyxPQUFPO1FBQ0wsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHO1FBQ2hCLFdBQVcsRUFBRTtZQUNYLGtCQUFrQixFQUFFO2dCQUNsQixlQUFlLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUTtnQkFDbEQsV0FBVyxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUk7YUFDM0M7WUFDRCxZQUFZLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLO1lBQ2hDLHVCQUF1QixFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCO1NBQ3ZEO0tBQ0YsQ0FBQztBQUNKLENBQUM7QUFaRCxzQkFZQztBQWdERDtJQUFBO1FBQ0U7O1dBRUc7UUFDSCxVQUFLLEdBQWUsRUFBRSxDQUFDO0lBa0J6QixDQUFDO0lBakJDLCtCQUFHLEdBQUgsVUFBSSxJQUFtQjtRQUNyQixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTTtZQUFFLE9BQU87UUFDM0YsSUFBTSxNQUFNLEdBQUcsT0FBTyxJQUFJLENBQUMsTUFBTSxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDL0UsSUFBTSxLQUFLLEdBQWE7WUFDdEIsR0FBRyxFQUFFLElBQUksQ0FBQyxRQUFRO1lBQ2xCLElBQUksRUFBRTtnQkFDSixXQUFXLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsb0JBQW9CLEVBQUU7Z0JBQ2xFLGdCQUFnQixFQUFFLElBQUksQ0FBQyxnQkFBZ0I7Z0JBQ3ZDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztnQkFDakIsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLElBQUksTUFBTTthQUM5QjtTQUNGLENBQUM7UUFDRixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN6QixDQUFDO0lBQ0Qsb0NBQVEsR0FBUjtRQUNFLE9BQU8sb0JBQVUsQ0FBQyxNQUFNLENBQUMsWUFBSSxFQUFFLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUM5RixDQUFDO0lBQ0gsd0JBQUM7QUFBRCxDQUFDLEFBdEJELElBc0JDIn0=