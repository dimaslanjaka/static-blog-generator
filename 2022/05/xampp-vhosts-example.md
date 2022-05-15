---
title: XAMPP vhosts config example
description:
date:
updated:
---

```apache
<VirtualHost *:80>
    ServerAdmin dimaslanjaka@gmail.com
    ServerName wp.webmanajemen.com
    ServerAlias wp.webmanajemen.com
    DocumentRoot "/opt/lampp/htdocs"
    ErrorLog "logs/wp.webmanajemen.com-error_log"
    CustomLog "logs/wp.webmanajemen.com-access_log" common
    <IfModule mod_dir.c>
        DirectoryIndex index.php index.pl index.cgi index.html index.xhtml index.htm
    </IfModule>
    <Directory /opt/lampp/htdocs>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
        Order allow,deny
        Allow from all
    </Directory>
</VirtualHost>


<VirtualHost *:80>
    ServerAdmin dimaslanjaka@gmail.com
    ServerName adsense.webmanajemen.com
    ServerAlias adsense.webmanajemen.com
    DocumentRoot /media/dimaslanjaka/DATA/Repositories/gh-pages
    <Directory /media/dimaslanjaka/DATA/Repositories/gh-pages>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
        Order allow,deny
        Allow from all
    </Directory>
    ErrorLog logs/adsense-error.log
    CustomLog logs/adsenser-access.log combined
    <IfModule mod_dir.c>
        DirectoryIndex index.php index.pl index.cgi index.html index.xhtml index.htm
    </IfModule>
</VirtualHost>
```
