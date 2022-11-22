"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.navigation = void 0;
const typedoc_1 = require("typedoc");
/**
 * Рендерит панель навигации.
 */
const navigation = (context) => (props) => {
    const categories = formatFileHierarchy(props.model.project.children || []);
    return (typedoc_1.JSX.createElement("div", { class: 'tree' },
        typedoc_1.JSX.createElement("div", { class: 'tree-settings' }, context.settings()),
        typedoc_1.JSX.createElement("div", { class: 'tree-config' },
            typedoc_1.JSX.createElement("button", { class: 'tree-config__button tree-config__button--expand js-tree-expand', title: 'Expand All' },
                typedoc_1.JSX.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', x: '0px', y: '0px', viewBox: '0 0 490.72 490.72', fill: 'currentColor' },
                    typedoc_1.JSX.createElement("path", { d: 'M480.027,288.027H10.693c-5.867,0-10.667,4.8-10.667,10.667c0,5.867,4.8,10.667,10.667,10.667h213.333v144.96l-45.76-45.76c-4.267-4.053-10.987-3.947-15.04,0.213c-3.947,4.16-3.947,10.667,0,14.827l64,64c4.16,4.16,10.88,4.16,15.04,0l64-64c4.053-4.267,3.947-10.987-0.213-15.04c-4.16-3.947-10.667-3.947-14.827,0l-45.867,45.76V309.36h234.667c5.867,0,10.667-4.8,10.667-10.667C490.693,292.827,485.893,288.027,480.027,288.027z' }),
                    typedoc_1.JSX.createElement("path", { d: 'M10.693,224.027h469.333c5.867,0,10.667-4.8,10.667-10.667c0-5.867-4.8-10.667-10.667-10.667H245.36V36.4l45.76,45.76c4.267,4.053,10.987,3.947,15.04-0.213c3.947-4.16,3.947-10.667,0-14.827l-64-64c-4.16-4.16-10.88-4.16-15.04,0l-64,64c-4.053,4.267-3.947,10.987,0.213,15.04c4.16,3.947,10.667,3.947,14.827,0l45.867-45.76v166.293H10.693c-5.867,0-10.667,4.8-10.667,10.667C0.027,219.227,4.827,224.027,10.693,224.027z' }))),
            typedoc_1.JSX.createElement("button", { class: 'tree-config__button tree-config__button--collapse js-tree-collapse', title: 'Collapse All' },
                typedoc_1.JSX.createElement("svg", { viewBox: '0 0 16 16', xmlns: 'http://www.w3.org/2000/svg', fill: 'currentColor' },
                    typedoc_1.JSX.createElement("path", { "fill-rule": 'evenodd', d: 'M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8zm7-8a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 4.293V.5A.5.5 0 0 1 8 0zm-.5 11.707-1.146 1.147a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 11.707V15.5a.5.5 0 0 1-1 0v-3.793z' }))),
            typedoc_1.JSX.createElement("button", { class: 'tree-config__button tree-config__button--target js-tree-target', title: 'Scroll to current file' },
                typedoc_1.JSX.createElement("svg", { viewBox: '0 0 24 24', xmlns: 'http://www.w3.org/2000/svg', fill: 'currentColor' },
                    typedoc_1.JSX.createElement("circle", { cx: '12', cy: '12', r: '3' }),
                    typedoc_1.JSX.createElement("path", { d: 'M13 4.069V2h-2v2.069A8.008 8.008 0 0 0 4.069 11H2v2h2.069A8.007 8.007 0 0 0 11 19.931V22h2v-2.069A8.007 8.007 0 0 0 19.931 13H22v-2h-2.069A8.008 8.008 0 0 0 13 4.069zM12 18c-3.309 0-6-2.691-6-6s2.691-6 6-6 6 2.691 6 6-2.691 6-6 6z' })))),
        typedoc_1.JSX.createElement("div", { class: 'tree-content' },
            typedoc_1.JSX.createElement(Navigation, Object.assign({}, categories, { context: context })))));
};
exports.navigation = navigation;
const Navigation = ({ id, categories, items, context, }) => (typedoc_1.JSX.createElement("ul", { class: 'js-category-list category', "data-id": id },
    Object.entries(categories).map(([key, item]) => (typedoc_1.JSX.createElement("li", null,
        typedoc_1.JSX.createElement("span", { class: 'js-category-title category__title', "data-id": item.id },
            typedoc_1.JSX.createElement("div", { class: 'category__folder', "data-id": item.id }),
            key),
        typedoc_1.JSX.createElement(Navigation, { id: item.id, categories: item.categories, items: item.items, context: context })))),
    items.map((item) => {
        var _a;
        return (typedoc_1.JSX.createElement("li", null,
            typedoc_1.JSX.createElement("a", { class: 'category__link js-category-link category__link--ts', href: context.urlTo(item), "data-id": item.url && `/${item.url}` }, item.title),
            typedoc_1.JSX.createElement("ul", null, (_a = item.children) === null || _a === void 0 ? void 0 : _a.map((subItem) => (typedoc_1.JSX.createElement("li", { class: subItem.cssClasses },
                typedoc_1.JSX.createElement("a", { class: 'category__link js-category-link', href: context.urlTo(subItem), "data-id": subItem.url && `/${subItem.url}` },
                    context.icons[subItem.kind](),
                    subItem.name)))))));
    })));
const getName = (item) => { var _a, _b; return ((_b = (_a = item.sources) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.fileName) || ''; };
const formatFileHierarchy = (values) => {
    const result = {
        items: [],
        categories: {},
        id: 'root',
    };
    for (const item of values) {
        const titleSplit = getName(item).split('/');
        addToCategory(result, item, titleSplit, 0);
    }
    return result;
};
const addToCategory = (category, item, titleSplit, idx) => {
    if (idx === titleSplit.length - 1) {
        category.items.push(Object.assign(Object.assign({}, item), { title: titleSplit[idx] }));
        return;
    }
    const title = titleSplit[idx];
    if (!title) {
        return;
    }
    if (!category.categories[title]) {
        // eslint-disable-next-line no-param-reassign
        category.categories[title] = {
            items: [],
            categories: {},
            id: `${category.id}-${title}`,
        };
    }
    const categoryToAdd = category.categories[title];
    if (!categoryToAdd) {
        return;
    }
    addToCategory(categoryToAdd, item, titleSplit, idx + 1);
};
