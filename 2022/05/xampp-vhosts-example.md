---
title: XAMPP vhosts config example
description:
date:
updated:
---

- important for linux and mac users. Make sure permission of xampp, open `etc/httpd.conf` change **nobody** and **nogroup** with your username
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
User nobody
Group nogroup
</IfModule>
```

- open and edit `httpd-vhosts.conf`
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
