---
title: gulp src pattern
webtitle: NodeJS
subtitle: macam-macam source pattern pada gulp
date: 2022-04-01T17:34:31+0000
updated: 2022-04-01T17:34:31+0000
---

<!--https://www.google.com/search?client=firefox-b-d&q=gulp+pattern+exclude+all+in+subfolder-->
## Pattern Untuk Mengecualikan Seluruh File Dalam Subfolder (Termasuk Di Dalam Folder Itu Sendiri/Subfiles)
```pattern
!src/**/*
```

contoh struktur folder
```text
file.root
file.php
src/file.txt
src/sub/file.txt
```

hasil pattern
```
file.root
file.php
```

## Pattern Untuk Mengecualikan Seluruh File Berawalan Dengan Underscore (`_`)
```bash
# including subfolder files
!src/**/_*/**/*
# src subfiles
!src/**/_*/
```

## Contoh
Contoh daftar struktur folder
```text
file.txt
folder
folder/file.txt
folder/_subfolder
folder/_subfolder/file.txt
folder/subfolder
folder/subfolder/file.txt
_folder
_folder/file.txt
_folder/_subfolder
_folder/_subfolder/file.txt
_folder/subfolder
_folder/subfolder/file.txt
```
Contoh Gulp NodeJS
```js
gulp.task('default', function() {
  return gulp.src([
      'src/**/*',         // select all files
      '!src/**/_*/',      // exclude folders starting with '_'
      '!src/**/_*/**/*',  // exclude files/subfolders in folders starting with '_'
    ])
    .pipe(gulp.dest('dist'));
});
```
Contoh hasil diatas
```text
file.txt
folder
folder/file.txt
folder/subfolder
folder/subfolder/file.txt
```