## git.webmanajemen.com compiler
- node 12.22.6

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
# Process articles from ./src-posts into ./source/__posts
npx gulp article:copy # safely using npx
```
