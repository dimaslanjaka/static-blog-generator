---
title: XAMPP vhosts config full example and guide
description: Sample configuration for xampp virtual hosts 100% work tested 2022
date: 2022-05-15T02:40:27+0000
updated: 2022-05-15T02:40:27+0000
---

## Sample configuration for xampp virtual hosts 100% work tested 2022
XAMPP vhosts config full example and guide

- important for linux and mac users. Make sure permission of xampp, open `etc/httpd.conf` change **nobody** and **nogroup** with your username and your group
```apache
<IfModule unixd_module>
#
# If you wish httpd to run as a different user or group, you must run
# httpd as root initially and it will switch.  
#
# User/Group: The name (or #number) of the user/group to run httpd as.
# It is usually good practice to create a dedicated user and group for
# running httpd, as with most system services.
#
#User daemon
#Group daemon
#User nobody
#Group nogroup
User dimaslanjaka
Group dimaslanjaka
</IfModule>
```

- enable xampp virtual hosts
  > The virtual hosts conf by defualt is disabled in httpd.conf, in order to allow virtual hosts in XAMPP **under** Ubuntu you have to uncomment line `480` in `httpd.conf`
  uncomment below codes:
```apache
# Virtual hosts
Include etc/extra/httpd-vhosts.conf
```

- open and edit `etc/extra/httpd-vhosts.conf`
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
