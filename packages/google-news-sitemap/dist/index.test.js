"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var xmlbuilder_1 = (0, tslib_1.__importDefault)(require("xmlbuilder"));
var _1 = (0, tslib_1.__importStar)(require("."));
var builder = new _1.default();
builder.add({
    location: "http://example.com/article1",
    title: "item 1",
    publication_date: "May 24, 2012",
    publication_language: "en",
    author: "Dimas Lanjaka",
});
builder.add({
    location: "http://example.com/article2",
    title: "item 2",
    publication_language: "en",
    publication_date: "May 25, 2012",
    author: "Dimas Lanjaka",
});
builder.items.forEach(function (item) {
    var prepare = {
        loc: item.loc,
        news: {
            publication: {
                name: item.news.publication.name,
                language: item.news.publication.language,
            },
            publication_date: item.news.publication_date,
            title: item.news.title,
        },
    };
    var build = (0, _1.parse)(prepare);
    build.loc = prepare.loc;
    _1.root.urlset.url.push(build);
});
var xml = xmlbuilder_1.default.create(_1.root, { version: "1.0", encoding: "UTF-8" }).end({ pretty: true });
console.log(xml);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHVFQUFvQztBQUNwQyxpREFBZ0U7QUFFaEUsSUFBTSxPQUFPLEdBQUcsSUFBSSxVQUFpQixFQUFFLENBQUM7QUFDeEMsT0FBTyxDQUFDLEdBQUcsQ0FBQztJQUNWLFFBQVEsRUFBRSw2QkFBNkI7SUFDdkMsS0FBSyxFQUFFLFFBQVE7SUFDZixnQkFBZ0IsRUFBRSxjQUFjO0lBQ2hDLG9CQUFvQixFQUFFLElBQUk7SUFDMUIsTUFBTSxFQUFFLGVBQWU7Q0FDeEIsQ0FBQyxDQUFDO0FBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQztJQUNWLFFBQVEsRUFBRSw2QkFBNkI7SUFDdkMsS0FBSyxFQUFFLFFBQVE7SUFDZixvQkFBb0IsRUFBRSxJQUFJO0lBQzFCLGdCQUFnQixFQUFFLGNBQWM7SUFDaEMsTUFBTSxFQUFFLGVBQWU7Q0FDeEIsQ0FBQyxDQUFDO0FBRUgsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJO0lBQ3pCLElBQU0sT0FBTyxHQUFHO1FBQ2QsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO1FBQ2IsSUFBSSxFQUFFO1lBQ0osV0FBVyxFQUFFO2dCQUNYLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJO2dCQUNoQyxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUTthQUN6QztZQUNELGdCQUFnQixFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCO1lBQzVDLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUs7U0FDdkI7S0FDRixDQUFDO0lBQ0YsSUFBTSxLQUFLLEdBQWdCLElBQUEsUUFBSyxFQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztJQUN4QixPQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDOUIsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFNLEdBQUcsR0FBRyxvQkFBVSxDQUFDLE1BQU0sQ0FBQyxPQUFJLEVBQUUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ2pHLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMifQ==