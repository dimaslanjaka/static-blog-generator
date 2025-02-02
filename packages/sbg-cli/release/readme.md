# Release `sbg-cli` tarball
## Releases
| version | tarball url |
| :--- | :--- |
| 1.0.0 | https://github.com/dimaslanjaka/static-blog-generator/raw/a2cc158f3/packages/sbg-cli/release/sbg-cli-1.0.0.tgz |
| 1.0.1 | https://github.com/dimaslanjaka/static-blog-generator/raw/bd13ceb8e/packages/sbg-cli/release/sbg-cli-1.0.1.tgz |
| 1.0.2 | https://github.com/dimaslanjaka/static-blog-generator/raw/222abf0a3/packages/sbg-cli/release/sbg-cli-1.0.2.tgz |
| 1.0.3 | https://github.com/dimaslanjaka/static-blog-generator/raw/9056cbf64/packages/sbg-cli/release/sbg-cli-1.0.3.tgz |
| 1.0.4 | https://github.com/dimaslanjaka/static-blog-generator/raw/125dccc2f/packages/sbg-cli/release/sbg-cli-1.0.4.tgz |
| 1.0.5 | https://github.com/dimaslanjaka/static-blog-generator/raw/280b579a0/packages/sbg-cli/release/sbg-cli-1.0.5.tgz |
| 1.0.6 | https://github.com/dimaslanjaka/static-blog-generator/raw/33a0a26c2/packages/sbg-cli/release/sbg-cli-1.0.6.tgz |
| 1.1.0 | https://github.com/dimaslanjaka/static-blog-generator/raw/09fe38901/packages/sbg-cli/release/sbg-cli-1.1.0.tgz |
| 2.0.0 | https://github.com/dimaslanjaka/static-blog-generator/raw/b9effb4bf/packages/sbg-cli/release/sbg-cli-2.0.0.tgz |
| latest | https://github.com/dimaslanjaka/static-blog-generator/raw/b9effb4bf/packages/sbg-cli/release/sbg-cli.tgz |
| latest | https://github.com/dimaslanjaka/static-blog-generator/raw/master/packages/sbg-cli/release/sbg-cli.tgz |

use this tarball with `resolutions`:
```json
{
  "resolutions": {
    "sbg-cli": "<url of tarball>"
  }
}
```

## Releases

    ## Get URL of `sbg-cli` Release Tarball
- select tarball file
![gambar](https://user-images.githubusercontent.com/12471057/203216375-8af4b5d9-00c2-40fb-8d3d-d220beaabd46.png)
- copy raw url
![gambar](https://user-images.githubusercontent.com/12471057/203216508-7590cbb9-a1ce-47d6-96ca-8d82149f0762.png)
- or copy download url
![gambar](https://user-images.githubusercontent.com/12471057/203216541-3807d2c3-5213-49f3-b93d-c626dbae3b2e.png)
- then run installation from command line
```bash
npm i https://....url-tgz
```
for example
```bash
npm i https://github.com/dimaslanjaka/nodejs-package-types/raw/main/release/nodejs-package-types.tgz
```

## URL Parts Explanations
> https://github.com/github-username/github-repo-name/raw/github-branch-name/path-to-file-with-extension