---
title: Git CLI Delete History Commit
webtitle: WMI Gitlab
subtitle: ""
lang: en
date: 2020-03-08T14:10:00.002+07:00
type: post
tags: []
author:
  nick: Kuswati
  link: https://www.blogger.com/profile/09256263851708439294
  email: noreply@blogger.com
modified: 2020-03-08T14:10:38.621+07:00
category:
  - Tips & Tricks
comments: true
cover: https://cdn.icon-icons.com/icons2/1488/PNG/512/5347-github_102542.png
location: ""

---

<ol><li>Checkout</li><pre>git checkout --orphan latest_branch</pre><li>Add all the files </li><pre>git add -A</pre><li>Commit the changes </li><pre>git commit -am "commit message"</pre><li>Delete the branch </li><pre><br>git branch -D master</pre><li>Rename the current branch to master </li><pre><br>git branch -m master</pre><li>Finally, force update your repository</li><pre><br>git push -f origin master</pre></ol> <div class="separator" style="clear: both; text-align: center;"><a href="https://cdn.icon-icons.com/icons2/1488/PNG/512/5347-github_102542.png" imageanchor="1" style="margin-left: 1em; margin-right: 1em;" rel="noopener noreferer nofollow"><img border="0" src="https://cdn.icon-icons.com/icons2/1488/PNG/512/5347-github_102542.png" width="100%"></a></div>