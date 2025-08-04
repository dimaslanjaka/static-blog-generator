# sbg-api test unit project

please add below codes to `sbg-api/package.json` then `yarn install` to link `sbg-api` in `test/fixtures/node_modules/sbg-api`

```json
  "workspaces": [
    "test/fixtures"
  ]
```

## to test using a lot of posts

```bash
git clone --branch posts --single-branch https://github.com/dimaslanjaka/source-posts.git
```

change `_config.yml` property `post_dir` to `source-posts`