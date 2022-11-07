const InstantIndexing = require('../src')
const serviceConfig = require('../src/config')

const indexing = new InstantIndexing(serviceConfig)
indexing.scanSitemap('https://www.webmanajemen.com/sitemap.txt')
