---
date: 2022-03-31T22:38:52+07:00
subtitle: how to add existing local repository folder to submodule
tags:
  - GitHub
title: git add existing local repository folder to submodule
updated: 2022-03-31T23:51:59+07:00
uuid: df364b7a-2f1e-4888-8f8f-2a34a28ccdce
lang: en
category:
  - Uncategorized
author:
  name: Dimas Lanjaka
  link: https://www.webmanajemen.com/
  email: dimaslanjaka@gmail.com
  image:
    url: https://res.cloudinary.com/dimaslanjaka/image/fetch/https://imgdb.net/images/3600.jpg
    width: 1944
    height: 2592
  social_links:
    github: https://github.com/dimaslanjaka
    youtube: https://youtube.com/p/L3n4r0x
comments: true
wordcount: 267
excerpt: how to add existing local repository folder to submodule
description: how to add existing local repository folder to submodule
type: post
---

## From repository subdirectory to git submodule
The following steps are based on the repository introduced in the previous section. They will explain how to turn a subdirectory of a project into an independent git repository and how to use this new repository as submodule, a foreign repository embedded within a dedicated subdirectory of the source tree of a project.

## Folder structure example
```bash
# this is parent repository
~/master/.git
# this is another local repository
~/other/.git
```

## Make a backup
**IMPORTANT** to make a backup both of folders. compress zip them (master and other).

## Copy .git folder
Copy the **.git** folder from the local folder repository to the parent repository. `.git/modules`.

example:
```bash
# copy ~/other/.git to ~/master/.git/modules/other/.git
cp ~/other/.git ~/master/.git/modules/other/
```

## Copy repository folder
Copy the other local repository to the parent repository.

example:
```bash
# copy ~/other to ~/master/other
cp ~/other ~/master/
```

## Create .git file
Create **.git** file instead of folder. input following codes:
```
gitdir: ../.git/modules/other
```
make sure `../.git/modules/other` is located to `~/master/.git/modules/other/.git/modules/other`.

## Add .gitmodules
add `.gitmodules` to the parent repository
```bash
touch ~/master/.gitmodules
```
put following codes to .gitmodules
```profile
[submodule "<path subfolder>"]
	path = <path subfolder>
	url = <url github repository>
	branch = <branch name of other local repository>
```
example:
```profile
[submodule "other"]
	path = other
	url = https://github.com/dimaslanjaka/dimaslanjaka.github.io
	branch = posts
```

## Execute command line
```bash
git submodule absorbgitdirs
git submodule update --remote
```

incoming terms:
  - git add subfolder repository to submodule
  - git add submodule from subfolder
	- git add other subfolder git to submodule
	- git move other repository as submodule
