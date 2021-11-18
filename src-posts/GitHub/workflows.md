---
title: GitHub Workflows
webtitle: WMI GitHub
subtitle: "Semua yang kamu harus tau tentang GitHub Workflows"
lang: id
date: 2021-11-18T22:00:00
type: post
tags:
  - GitHub
keywords:
  - GitHub
  - workflows
  - yml
author:
  nick: "Dimas Lanjaka"
  link: "https://github.com/dimaslanjaka"

category:
  - Programming

cover: "/GitHub/workflows/cover.png"
location: Indonesia
comments: true
---

GitHub menyediakan templat alur kerja (<i>preconfigured workflow templates</i>) yang telah dikonfigurasi sebelumnya yang dapat Anda sesuaikan untuk membuat alur kerja integrasi berkelanjutan (<i>CI</i>) Anda sendiri. GitHub menganalisis kode Anda dan menunjukkan template <i>CI</i> yang mungkin berguna untuk repositori Anda. Misalnya, jika repositori Anda berisi Node/Program. [[source](https://docs.github.com/en/actions/quickstart)]

Simplenya kamu dapat menggunakan program kamu dengan VPS gratis yang disediakan oleh GitHub. Meskipun begitu, kamu tidak dapat leluasa menggunakannya seperti VPS provider lain. Di GitHub Workflow kamu hanya dapat menggunakannya dengan logic/logika program-mu dalam 1x jalan.

Github Workflow merupakan alternatif Continous Integration Gratis Dari Github. Sama halnya Travis CI, CircleCI, Jenkins, AppVeyor, Drone.io, GitLab, dan lain sebagainya.

## Fitur-fitur dari GitHub Workflow
- CI (Continous Integration) adalah praktik mengotomatiskan integrasi perubahan kode dari banyak kontributor ke dalam satu proyek perangkat lunak.
- Membangun GitHub Pages
- Test kode-mu di cloud tanpa menggunakan resources device-mu
- Test kode-mu dengan berbagai tipe device/machine, misal MAC, Windows, Linux (ubuntu, debian, dan lain-lain)
- Dan banyak lagi

## Konfigurasi
Sama halnya dengan Continous Integration (CI) lain, GitHub Workflow juga membutuhkan konfigurasi dalam bentuk `yaml` file.
### Berikut struktur konfigurasi github workflow:
```yaml
github-project/
├─ .github/
│  ├─ workflow/
│  │  ├─ github-workflow-config.yml <-- konfigurasi github workflow
├─ .git/
├─ .gitignore
```
### Isi konfigurasi github workflow `github-workflow-config.yml`
```yaml
name: GitHub Actions Demo # nama flow
on: [push] # CI akan jalan pada saat push event
jobs:
  NodeJS:
    runs-on: ubuntu-latest # OS yang akan kamu gunakan
    steps: # daftar urutan command line yang akan dijalankan
      - run: echo "🎉 job otomatis berjalan saat dipicu oleh ${{ github.event_name }} event."
      - run: echo "🐧 job ini berjalan pada sistem operasi ${{ runner.os }} server hosted dari GitHub!"
      - run: echo "🔎 nama branch repository-mu adalah ${{ github.ref }} and repository-mu ialah ${{ github.repository }}."
      - name: Check out repository code
        uses: actions/checkout@v2 # ini wajib ya, untuk memuat repository kamu ke dalam home os
      - run: echo "💡 The ${{ github.repository }} repository berhasil di duplikasi ke dalam os ${{ runner.os }}"
      - run: echo "🖥️ Workflow ini sekarang sudah siap untuk melakukan rangkaian program yang ada pada repository ${{ github.repository }}#${{ github.ref }}"
      - name: Daftar keseluruhan file di dalam repository
        run: |
          ls ${{ github.workspace }}
      - run: echo "🍏 Job status ${{ job.status }}."
```

## Mempercepat kinerja github workflow
Satu-satunya cara untuk mempercepat kinerja github workflow (ci) adalah menggunakan metode `Cache Strategy`. Metode cache ini dapat beruba in-program function dan github action method, kamu juga dapat menggunakan keduanya untuk mepercepat kinerja Continous Integration di github workflow.

**Metode Cache Menggunakan Package GitHub Workflow**

cara ini menggunakan fungsi internal dari github workflow itu sendiri untuk menyimpan cache. Berikut contoh konfigurasi github workflow cache:
```yaml
name: CI NPM Menggunakan Cache
on: push
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2 # ini wajib
      - name: Metode Cache Dimulai
        uses: actions/cache@v2 # ini nama packagenya
        with:
          # folder yang akan di cache ialah `~/.npm, ./node_modules, dan ./vendor folder
          path: |
            ~/.npm
            ./node_modules
            ./vendor
          key: ${{ runner.os }}-build-${{ hashFiles('package-lock.json') }} # ini kunci menyimpan/save
          restore-keys: ${{ runner.os }}-build # ini kunci restore
      - run: npm install # install project nodejs
```
dengan konfigurasi diatas, command `npm install` akan sangat lebih cepat ketimbang tidak menggunakan cache. Yang biasanya menginstall biasa memerlukan waktu 10 menit, sekarang hanya butuh 2 menit saja untuk menyelesaikan-nya.

`build-${{ hashFiles('package-lock.json') }}` merupakan kunci untuk save, apabila dependencies atau packages berubah atau di update, maka kunci ini akan membuat cache baru otomatis sesuai dengan yang saat itu dikerjakan oleh workflow. Kunci tersebut akan membuat cache index baru misalnya seperti `build-d5ea0750`. Apabila kamu tidak memberikan kunci unik seperti `build-${{ hashFiles('package-lock.json') }}`, maka workflow tidak akan membuat cache baru melainkan mengambil cache yang lama dan akan terus mengulangi instalasi. Jadi perlu untuk memberikan kode unik di kunci save.


