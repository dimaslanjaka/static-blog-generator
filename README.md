## www.webmanajemen.com compiler
- node 12.22.6 - 14.8.1

# NodeJS Blogging System
todo:
- Admin Panel
- Blogger XML Import
- External to local images
- SEO improvement

# Project Structure
- Source posts
  - ./src-posts write all source posts here
- Compiler
```shell
npm install
# Process articles from ./src-posts into ./source/_posts
npx gulp article:copy # safely using npx
# Generate blog
npx hexo generate
```

### Powered By Hexo

[![Build www.webmanajemen.com](https://github.com/dimaslanjaka/dimaslanjaka.github.io/actions/workflows/page.yml/badge.svg?branch=compiler)](https://github.com/dimaslanjaka/dimaslanjaka.github.io/actions/workflows/page.yml)
<a href="https://github.com/dimaslanjaka/dimaslanjaka.github.io/tree/compiler" alt="github">Github <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" width="20px" height="20px" /></a> [dimaslanjaka.github.io](https://dimaslanjaka.github.io)