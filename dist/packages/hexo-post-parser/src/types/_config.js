"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var upath_1 = require("upath");
var yaml_1 = __importDefault(require("yaml"));
var yargs_1 = __importDefault(require("yargs"));
var argv = (0, yargs_1.default)(process.argv.slice(2)).argv;
var nocache = argv['nocache'];
var verbose = argv['verbose'];
var def = {
    // Site
    title: 'Hexo',
    subtitle: '',
    description: '',
    author: 'John Doe',
    language: 'en',
    timezone: '',
    // URL
    url: 'http://example.com',
    root: '/',
    permalink: ':year/:month/:day/:title/',
    permalink_defaults: {},
    pretty_urls: {
        trailing_index: true,
        trailing_html: true
    },
    // Directory
    source_dir: 'source',
    public_dir: 'public',
    tag_dir: 'tags',
    archive_dir: 'archives',
    category_dir: 'categories',
    code_dir: 'downloads/code',
    i18n_dir: ':lang',
    skip_render: [],
    // Mapper
    title_map: {},
    tag_map: {},
    category_map: {},
    tag_group: {},
    category_group: {},
    // Writing
    new_post_name: ':title.md',
    default_layout: 'post',
    titlecase: false,
    external_link: {
        enable: true,
        field: 'site',
        exclude: ''
    },
    filename_case: 0,
    render_drafts: false,
    post_asset_folder: false,
    relative_link: false,
    future: true,
    highlight: {
        enable: true,
        auto_detect: false,
        line_number: true,
        tab_replace: '',
        wrap: true,
        exclude_languages: [],
        hljs: false
    },
    prismjs: {
        enable: false,
        preprocess: true,
        line_number: true,
        tab_replace: ''
    },
    // Category & Tag
    default_category: 'uncategorized',
    default_tag: null,
    // Date / Time format
    date_format: 'YYYY-MM-DD',
    time_format: 'HH:mm:ss',
    updated_option: 'mtime',
    // * mtime: file modification date (default)
    // * date: use_date_for_updated
    // * empty: no more update
    // Pagination
    per_page: 10,
    pagination_dir: 'page',
    // Extensions
    theme: 'landscape',
    server: {
        cache: false
    },
    // Deployment
    deploy: {},
    // ignore files from processing
    ignore: [],
    // Category & Tag
    meta_generator: true
};
var config = def;
// find _config.yml
var file = (0, upath_1.join)(process.cwd(), '_config.yml');
if ((0, fs_1.existsSync)(file)) {
    var readConfig = (0, fs_1.readFileSync)(file, 'utf-8');
    var parse = yaml_1.default.parse(readConfig);
    config = Object.assign(def, parse, {
        verbose: verbose,
        generator: {
            cache: !nocache
        }
    });
}
(0, fs_1.writeFileSync)((0, upath_1.join)(__dirname, '_config_project.json'), JSON.stringify(config));
exports.default = config;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2NvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2hleG8tcG9zdC1wYXJzZXIvc3JjL3R5cGVzL19jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx5QkFBNkQ7QUFDN0QsK0JBQTZCO0FBQzdCLDhDQUF3QjtBQUN4QixnREFBMEI7QUFHMUIsSUFBTSxJQUFJLEdBQUcsSUFBQSxlQUFLLEVBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDL0MsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2hDLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUVoQyxJQUFNLEdBQUcsR0FBRztJQUNWLE9BQU87SUFDUCxLQUFLLEVBQUUsTUFBTTtJQUNiLFFBQVEsRUFBRSxFQUFFO0lBQ1osV0FBVyxFQUFFLEVBQUU7SUFDZixNQUFNLEVBQUUsVUFBVTtJQUNsQixRQUFRLEVBQUUsSUFBSTtJQUNkLFFBQVEsRUFBRSxFQUFFO0lBQ1osTUFBTTtJQUNOLEdBQUcsRUFBRSxvQkFBb0I7SUFDekIsSUFBSSxFQUFFLEdBQUc7SUFDVCxTQUFTLEVBQUUsMkJBQTJCO0lBQ3RDLGtCQUFrQixFQUFFLEVBQUU7SUFDdEIsV0FBVyxFQUFFO1FBQ1gsY0FBYyxFQUFFLElBQUk7UUFDcEIsYUFBYSxFQUFFLElBQUk7S0FDcEI7SUFDRCxZQUFZO0lBQ1osVUFBVSxFQUFFLFFBQVE7SUFDcEIsVUFBVSxFQUFFLFFBQVE7SUFDcEIsT0FBTyxFQUFFLE1BQU07SUFDZixXQUFXLEVBQUUsVUFBVTtJQUN2QixZQUFZLEVBQUUsWUFBWTtJQUMxQixRQUFRLEVBQUUsZ0JBQWdCO0lBQzFCLFFBQVEsRUFBRSxPQUFPO0lBQ2pCLFdBQVcsRUFBRSxFQUFFO0lBQ2YsU0FBUztJQUNULFNBQVMsRUFBRSxFQUFFO0lBQ2IsT0FBTyxFQUFFLEVBQUU7SUFDWCxZQUFZLEVBQUUsRUFBRTtJQUNoQixTQUFTLEVBQUUsRUFBRTtJQUNiLGNBQWMsRUFBRSxFQUFFO0lBQ2xCLFVBQVU7SUFDVixhQUFhLEVBQUUsV0FBVztJQUMxQixjQUFjLEVBQUUsTUFBTTtJQUN0QixTQUFTLEVBQUUsS0FBSztJQUNoQixhQUFhLEVBQUU7UUFDYixNQUFNLEVBQUUsSUFBSTtRQUNaLEtBQUssRUFBRSxNQUFNO1FBQ2IsT0FBTyxFQUFFLEVBQUU7S0FDWjtJQUNELGFBQWEsRUFBRSxDQUFDO0lBQ2hCLGFBQWEsRUFBRSxLQUFLO0lBQ3BCLGlCQUFpQixFQUFFLEtBQUs7SUFDeEIsYUFBYSxFQUFFLEtBQUs7SUFDcEIsTUFBTSxFQUFFLElBQUk7SUFDWixTQUFTLEVBQUU7UUFDVCxNQUFNLEVBQUUsSUFBSTtRQUNaLFdBQVcsRUFBRSxLQUFLO1FBQ2xCLFdBQVcsRUFBRSxJQUFJO1FBQ2pCLFdBQVcsRUFBRSxFQUFFO1FBQ2YsSUFBSSxFQUFFLElBQUk7UUFDVixpQkFBaUIsRUFBRSxFQUFFO1FBQ3JCLElBQUksRUFBRSxLQUFLO0tBQ1o7SUFDRCxPQUFPLEVBQUU7UUFDUCxNQUFNLEVBQUUsS0FBSztRQUNiLFVBQVUsRUFBRSxJQUFJO1FBQ2hCLFdBQVcsRUFBRSxJQUFJO1FBQ2pCLFdBQVcsRUFBRSxFQUFFO0tBQ2hCO0lBQ0QsaUJBQWlCO0lBQ2pCLGdCQUFnQixFQUFFLGVBQWU7SUFDakMsV0FBVyxFQUFFLElBQUk7SUFDakIscUJBQXFCO0lBQ3JCLFdBQVcsRUFBRSxZQUFZO0lBQ3pCLFdBQVcsRUFBRSxVQUFVO0lBQ3ZCLGNBQWMsRUFBRSxPQUFPO0lBQ3ZCLDRDQUE0QztJQUM1QywrQkFBK0I7SUFDL0IsMEJBQTBCO0lBQzFCLGFBQWE7SUFDYixRQUFRLEVBQUUsRUFBRTtJQUNaLGNBQWMsRUFBRSxNQUFNO0lBQ3RCLGFBQWE7SUFDYixLQUFLLEVBQUUsV0FBVztJQUNsQixNQUFNLEVBQUU7UUFDTixLQUFLLEVBQUUsS0FBSztLQUNiO0lBQ0QsYUFBYTtJQUNiLE1BQU0sRUFBRSxFQUFFO0lBRVYsK0JBQStCO0lBQy9CLE1BQU0sRUFBRSxFQUFFO0lBRVYsaUJBQWlCO0lBQ2pCLGNBQWMsRUFBRSxJQUFJO0NBQ3JCLENBQUM7QUFjRixJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUM7QUFFakIsbUJBQW1CO0FBQ25CLElBQU0sSUFBSSxHQUFHLElBQUEsWUFBSSxFQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxhQUFhLENBQUMsQ0FBQztBQUNoRCxJQUFJLElBQUEsZUFBVSxFQUFDLElBQUksQ0FBQyxFQUFFO0lBQ3BCLElBQU0sVUFBVSxHQUFHLElBQUEsaUJBQVksRUFBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDL0MsSUFBTSxLQUFLLEdBQUcsY0FBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQWdCLENBQUM7SUFDcEQsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRTtRQUNqQyxPQUFPLFNBQUE7UUFDUCxTQUFTLEVBQUU7WUFDVCxLQUFLLEVBQUUsQ0FBQyxPQUFPO1NBQ2hCO0tBQ0YsQ0FBQyxDQUFDO0NBQ0o7QUFFRCxJQUFBLGtCQUFhLEVBQUMsSUFBQSxZQUFJLEVBQUMsU0FBUyxFQUFFLHNCQUFzQixDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBRS9FLGtCQUFlLE1BQWdCLENBQUMifQ==