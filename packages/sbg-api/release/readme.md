# Release `sbg-api` tarball
## Releases
| version | tarball url |
| :--- | :--- |
| 2.0.0 | https://github.com/dimaslanjaka/static-blog-generator/raw/faa31127b/packages/sbg-api/release/sbg-api-2.0.0.tgz |
| latest | https://github.com/dimaslanjaka/static-blog-generator/raw/faa31127b/packages/sbg-api/release/sbg-api.tgz |
| latest | https://github.com/dimaslanjaka/static-blog-generator/raw/sbg-api/packages/sbg-api/release/sbg-api.tgz |

use this tarball with `resolutions`:
```json
{
  "resolutions": {
    "sbg-api": "<url of tarball>"
  }
}
```

## Releases

    ## Get URL of `sbg-api` Release Tarball
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