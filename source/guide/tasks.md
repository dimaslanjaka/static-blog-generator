---
title: Gulp Task Lists
---

```
├── generate:assets
├── generate:template
├── generate:posts
├── generate:after
├─┬ generate:sitemap-xml
│ └─┬ <series>
│   ├── copy
│   ├── generateIndex
│   └── generatePages
├── generate:sitemap-news
├── generate:sitemap-html
├── generate:sitemap-txt
├─┬ generate:sitemap
│ └─┬ <series>
│   ├── generate:sitemap-news
│   ├── generate:sitemap-html
│   ├── generate:sitemap-txt
│   └─┬ generate:sitemap-xml
│     └─┬ <series>
│       ├── copy
│       ├── generateIndex
│       └── generatePages
├── generate:index
├── generate:label
├─┬ generate:archive
│ └─┬ <series>
│   ├── generate:index
│   └── generate:label
├── generate:feeds
├── generate:minify-html
├─┬ generate:minify
│ └─┬ <series>
│   └── generate:minify-html
├─┬ generate
│ └─┬ <series>
│   ├── generate:assets
│   ├── generate:template
│   ├── generate:posts
│   ├─┬ generate:archive
│   │ └─┬ <series>
│   │   ├── generate:index
│   │   └── generate:label
│   ├─┬ generate:sitemap
│   │ └─┬ <series>
│   │   ├── generate:sitemap-news
│   │   ├── generate:sitemap-html
│   │   ├── generate:sitemap-txt
│   │   └─┬ generate:sitemap-xml
│   │     └─┬ <series>
│   │       ├── copy
│   │       ├── generateIndex
│   │       └── generatePages
│   └── generate:after
├── copy:remove-inline-style
├── copy:assets
├── copy:posts
├─┬ copy
│ └─┬ <series>
│   ├── copy:assets
│   └── copy:posts
├─┬ copy:blogger
│ └─┬ <series>
│   ├─┬ copy
│   │ └─┬ <series>
│   │   ├── copy:assets
│   │   └── copy:posts
│   └── copy:remove-inline-style
├── deploy
├── clean:public
├── clean:posts
├── clean:db
├── clean:tmp
├─┬ clean
│ └─┬ <parallel>
│   ├── clean:db
│   ├── clean:tmp
│   ├── clean:posts
│   └── clean:public
├─┬ default
│ └─┬ <series>
│   ├─┬ copy
│   │ └─┬ <series>
│   │   ├── copy:assets
│   │   └── copy:posts
│   └─┬ generate
│     └─┬ <series>
│       ├── generate:assets
│       ├── generate:template
│       ├── generate:posts
│       ├─┬ generate:archive
│       │ └─┬ <series>
│       │   ├── generate:index
│       │   └── generate:label
│       ├─┬ generate:sitemap
│       │ └─┬ <series>
│       │   ├── generate:sitemap-news
│       │   ├── generate:sitemap-html
│       │   ├── generate:sitemap-txt
│       │   └─┬ generate:sitemap-xml
│       │     └─┬ <series>
│       │       ├── copy
│       │       ├── generateIndex
│       │       └── generatePages
│       └── generate:after
└── server
```