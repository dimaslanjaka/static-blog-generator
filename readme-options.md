# Options
options _config.yml format

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
