"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/*
    use nodeunit to run tests.
*/
var sitemap_gnews_1 = (0, tslib_1.__importDefault)(require("./sitemap-gnews"));
module.exports = {
    "stupid test": function (test) {
        var sitemap = new sitemap_gnews_1.default({
            publication_name: "",
            publication_language: "",
        });
        sitemap.item({
            location: "http://example.com/article1",
            title: "item 1",
            publication_date: "May 24, 2012",
        });
        sitemap.item({
            location: "http://example.com/article2",
            title: "item 2",
            publication_date: "May 25, 2012",
        });
        var expectedResult = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"><url><loc>http://example.com/article1</loc><news:news><news:publication><news:name>Untitled News</news:name><news:language>en</news:language></news:publication><news:publication_date>May 24, 2012</news:publication_date><news:title>item 1</news:title></news:news></url><url><loc>http://example.com/article2</loc><news:news><news:publication><news:name>Untitled News</news:name><news:language>en</news:language></news:publication><news:publication_date>May 25, 2012</news:publication_date><news:title>item 2</news:title></news:news></url></urlset>';
        var result = sitemap.xml();
        test.equal(result.length, expectedResult.length);
        test.equal(result, expectedResult);
        test.done();
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2l0ZW1hcC1nbmV3cy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3NpdGVtYXAtZ25ld3MudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQTs7RUFFRTtBQUNGLCtFQUF3QztBQUV4QyxNQUFNLENBQUMsT0FBTyxHQUFHO0lBQ2YsYUFBYSxFQUFFLFVBQVUsSUFBSTtRQUMzQixJQUFNLE9BQU8sR0FBRyxJQUFJLHVCQUFTLENBQUM7WUFDNUIsZ0JBQWdCLEVBQUUsRUFBRTtZQUNwQixvQkFBb0IsRUFBRSxFQUFFO1NBQ3pCLENBQUMsQ0FBQztRQUNILE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFDWCxRQUFRLEVBQUUsNkJBQTZCO1lBQ3ZDLEtBQUssRUFBRSxRQUFRO1lBQ2YsZ0JBQWdCLEVBQUUsY0FBYztTQUNqQyxDQUFDLENBQUM7UUFDSCxPQUFPLENBQUMsSUFBSSxDQUFDO1lBQ1gsUUFBUSxFQUFFLDZCQUE2QjtZQUN2QyxLQUFLLEVBQUUsUUFBUTtZQUNmLGdCQUFnQixFQUFFLGNBQWM7U0FDakMsQ0FBQyxDQUFDO1FBRUgsSUFBTSxjQUFjLEdBQ2xCLG1zQkFBbXNCLENBQUM7UUFDdHNCLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUU3QixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQ25DLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNkLENBQUM7Q0FDRixDQUFDIn0=