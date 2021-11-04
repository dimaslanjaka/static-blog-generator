---
title: Membuat array javascript unik
webtitle: WMI Gitlab
subtitle: img border=0
  src=https://static.cdn-cdpl.com/700x350/5615bb41d81fad8fe992985aec0e5f29/js.jpg
  data-original-width=700
lang: en
date: 2019-12-26T22:18:00.000+07:00
type: post
tags:
  - JS
  - Share
author:
  nick: Dimas Lanjaka Kumala Indra
  link: https://www.blogger.com/profile/17555754514989936273
  email: noreply@blogger.com
modified: 2019-12-26T22:18:11.234+07:00
category: []
comments: true
cover: https://static.cdn-cdpl.com/700x350/5615bb41d81fad8fe992985aec0e5f29/js.jpg
location: ""

---

<img border="0" src="https://static.cdn-cdpl.com/700x350/5615bb41d81fad8fe992985aec0e5f29/js.jpg" data-original-width="700" data-original-height="350"> <pre><br>function arrayUnik(A){<br>  uniq = A.filter(function(item, pos, self) {<br>      return self.indexOf(item) == pos;<br>  });<br>  return uniq;<br>}<br><br>/* Penggunaan */<br><br>var arraymu = [1,2,3,4,5,6,3,7,7,55,6,7,90,98,89,98,89,98,98,89,89];<br>console.log(arrayUnik(arraymu)); //Buka F12 developer tools untuk melihat hasilnya<br></pre> <b><ul><li>Menghapus duplikat array di javascript</li><li>Membuat array menjadi unik di javascript</li></ul></b>