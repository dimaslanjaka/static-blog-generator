---
title: PHP array magic trick and manipulations
webtitle: WMI Gitlab
subtitle: manipulating multidimensional array using arraymap/*** Ilterate
  multidimensional array simplicity* @desc modify and manipulate or populate
lang: en
date: 2020-03-23T23:21:00.003+07:00
type: post
tags:
  - PHP
  - Tips & Tricks
author:
  nick: Kuswati
  link: https://www.blogger.com/profile/09256263851708439294
  email: noreply@blogger.com
modified: 2020-03-23T23:24:56.448+07:00
category: []
comments: true
cover: https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png
location: ""
---

<div dir="ltr" style="text-align: left;" trbidi="on"><ol><li>manipulating multidimensional array using array_map</li><pre><br>/**<br>* Ilterate multidimensional array simplicity<br>* @desc modify and manipulate or populate multidimensional array with simple tricks<br>* @param array $arr<br>* @param function $callback<br>* @return Array<br>**/<br>function Map($arr, $callback)<br>{<br>  if (!is_callable($callback)) {<br>    throw new Exception("Callback must be function", 1);<br>  }<br><br>  return array_map(function ($key, $val) use ($callback) {<br>    return call_user_func($callback, $key, $val);<br>  }, array_keys($arr), $arr);<br>}<br></pre></ol> </div>