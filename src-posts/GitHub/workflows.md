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

cover: "workflows/cover.png"
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
      - run: echo "🎉 The job was automatically triggered by a ${{ github.event_name }} event."
      - run: echo "🐧 This job is now running on a ${{ runner.os }} server hosted by GitHub!"
      - run: echo "🔎 The name of your branch is ${{ github.ref }} and your repository is ${{ github.repository }}."
      - name: Check out repository code
        uses: actions/checkout@v2 # ini wajib ya, untuk memuat repository kamu ke dalam home os
      - run: echo "💡 The ${{ github.repository }} repository has been cloned to the runner."
      - run: echo "🖥️ The workflow is now ready to test your code on the runner."
      - name: List files in the repository
        run: |
          ls ${{ github.workspace }}
      - run: echo "🍏 This job's status is ${{ job.status }}."

```