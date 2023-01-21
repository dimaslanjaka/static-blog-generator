# Static Blog Generator v3 (under development)
HexoJS GUI and Helpers - Static Blog Generator NodeJS.

Static Blog Generator v3 using Gulp System.

Pre-processing all source posts before rendering from hexo. 
Useful for low-end devices to avoid memory heap errors. 
With this package you can prevent using large number of hexo plugins, because some function (runner) separated by task, so memory friendly.

were curently refactoring project using monorepo. Latest working build at https://github.com/dimaslanjaka/static-blog-generator/tree/ee53887be6cbce00dcc49e25a94fdc65c770300c

Features:
- Automatic SEO
- Finding broken images
- Finding broken links
- External link anonymizer using [safelinkify](https://www.npmjs.com/package/safelinkify)
