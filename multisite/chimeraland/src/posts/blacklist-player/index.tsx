import { readFileSync, writeFileSync } from 'fs-extra'
import { buildPost, postMap, postMeta, renderMarkdown } from 'hexo-post-parser'
import { JSDOM } from 'jsdom'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { join } from 'upath'
import { sbgProject } from '../../../project'

const metadata: postMeta = {
  title: 'Blacklist Player Chimeraland',
  date: '2022-11-07T19:54:01+07:00',
  updated: '2022-11-25T20:45:50+07:00',
  lang: 'id',
  permalink: '/chimeraland/blacklist-player.html',
  tags: ['Chimeraland', 'Blacklist', 'Player'],
  categories: ['Games', 'Chimeraland'],
  thumbnail:
    'https://res.cloudinary.com/dimaslanjaka/image/fetch/https://www.palmassgames.ru/wp-content/uploads/2021/07/screenshot_6-1-1024x504.png',
  author: 'L3n4r0x'
}
const translator = readFileSync(join(__dirname, 'translator.html'), 'utf-8')
const bodyfile = join(__dirname, 'body.md')
const bodymd = readFileSync(bodyfile, 'utf-8')
const bodyhtml = renderMarkdown(bodymd)
const dom = new JSDOM(bodyhtml)
Array.from(dom.window.document.querySelectorAll('tr')).forEach((tr) => {
  const player = tr.querySelector('td:nth-child(1)')
  if (player) {
    // console.log(player.innerHTML)
    player.setAttribute('notranslate', '')
  }
})
const body = dom.window.document.body.innerHTML
dom.window.close()
// console.log(body)

const post: postMap = { metadata, body: translator + '\n\n' + body }
const build = buildPost(post)
const saveTo = join(sbgProject, 'src-posts/blacklist-player.md')

writeFileSync(saveTo, build)

export function renderJSXtoHTML(
  content: React.ReactElement<any, string | React.JSXElementConstructor<any>>
) {
  const html = ReactDOMServer.renderToStaticMarkup(content).toString()
  return html
}
