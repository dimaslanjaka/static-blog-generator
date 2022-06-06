# binary static blog generator

## Tasks

| task name | description |
| :--- | :--- |
| clean | clean cache, generated caches, tmp folder, databases |
| copy | copy and process all posts from `src-posts` to `config.source_dir` in [_config.yml](https://github.com/dimaslanjaka/static-blog-generator/blob/d951721d632c720727db718fd481e532c2e493f1/_config.yml#L28-L38) |
| generate | render all files from `config.source_dir` to generated folder `config.public_dir` in [_config.yml](https://github.com/dimaslanjaka/static-blog-generator/blob/d951721d632c720727db718fd481e532c2e493f1/_config.yml#L28-L38) then ready to publish |
| deploy | deploy to github pages |
| server | development, render on-fly |

### Standalone Tasks
Standalone: is useful for low device to run one by one the tasks.
- read more example: [page.yml#L80](https://github.com/dimaslanjaka/dimaslanjaka.github.io/blob/c9c113ed51b2a6bbe50edc0ffd3d691980776a0f/.github/workflows/page.yml#L80-L112)

| task name | description |
| :--- | :--- |
| clean | clean all caches |
| copy:assets | copy post assets |
| copy:posts | copy and process posts |
| copy:remove-inline-style | remove inline style from html source/_posts (useful for migrated from blogger) |
| copy:blogger | `<series>`(`copy:assets`, `copy:posts`, `copy:remove-inline-style`) |
| generate:assets | copy all assets |
| generate:template | copy and process template |
| generate:posts | generate posts |
| generate:sitemap | generate sitemaps |
| generate:tags | generate tags |
| generate:categories | generate categories |
| generate:label | generate tags and categories |
| generate:index | generate homepage index |
| generate:archive | generate homepage, tags, and categories |
| generate:feeds | generate atom, rss |
| generate:after | process generated posts html including anonymize external links (safelinkify), add rel nofollow external link, etc |
| generate:minify | minify all html,css,js on public_dir in _config.yml |

### Arguments

| arg | description | example |
| :--- | :--- | :--- |
| --paths | custom paths | [copy section](#copy) |
| --nocache | dont use cache instead create new caches | - |
| --verbose | verbose | - |

### Example

### Copy
| usage | description |
| :--- | :--- |
| `sbg copy`| series of `copy:posts` and `copy:asets` |
| `sbg copy ---paths=shortcode,unit`| copy custom paths (comma separated) |

### Generate

`sbg generate`

series of `generate:assets`, `generate:template`, `generate:posts`
