# Options
options _config.yml format. [FULL EXAMPLE](https://github.com/dimaslanjaka/static-blog-generator-hexo/blob/master/_config.yml)

## External Links
Use Object instead boolean
```yaml
external_link:
  enable: true # or false
  field: site # or page
  exclude: # exclude these domains
    - webmanajemen.com
```

## Deployment
Deployment Section
```yaml
deploy:
  type: git
  repo: https://github.com/dimaslanjaka/dimaslanjaka.github.io.git
  branch: master
  message: "Git Deployment: {{ now('YYYY-MM-DD HH:mm:ss') }}"
  hostname: www.webmanajemen.com
  username: dimaslanjaka
  email: dimaslanjaka@gmail.com
```
