import axios from 'axios'
import Bluebird from 'bluebird'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import sharp from 'sharp'
import slugify from 'slugify'
import { basename, dirname, extname, join, toUnix } from 'upath'
import { hexoProject } from '../project'
import { array_unique } from '../src/utils/array'
import { walkDir } from '../src/utils/file-node'
import { escapeRegex } from '../src/utils/string'
import { isValidHttpUrl } from '../src/utils/url'
import materials from './materials.json'

const outputJSON = join(__dirname, '../src/utils/chimeraland-materials.json')
const publicDir = join(hexoProject, 'source/chimeraland')
Bluebird.all(materials.data)
  .map(async (mat) => {
    const type = 'materials'
    const pathname =
      '/' +
      join(
        'chimeraland',
        'materials',
        slugify(mat.name, { lower: true, trim: true })
      ) +
      '.html'
    const result = Object.assign(
      {},
      { images: [], videos: [], details: [], type, pathname },
      mat
    )

    Object.keys(result).forEach((key) => {
      const item = result[key]
      if (Array.isArray(item)) {
        if (key === 'details') {
          result[key] = <any>item
            .filter(function (x, i, a) {
              return a.indexOf(x) === i
            })
            .filter((str) => str.length > 0)
        }
      }
    })
    const imgFiles = array_unique(
      ['.jpg', '.png']
        .map((ext) =>
          join(
            __dirname,
            'materials',
            slugify(result.name, { lower: true, trim: true }) + ext
          )
        )
        .concat(result.images)
        .filter((path) => {
          if (/^https?:\/\//.test(path)) return true
          return existsSync(path)
        })
    )
    // find spawn spot location
    const spot = join(__dirname, 'locations', type + '-spot')
    if (existsSync(spot)) {
      const location = walkDir(spot)
        .filter((map) => {
          const filename = map.filename.toLowerCase()
          // remove desktop.ini
          if (extname(filename) === '.ini') return false
          const filenameToMatch = result.name.toLowerCase()
          const filepath = map.path
          const regexs = [
            new RegExp('^' + filenameToMatch, 'gi').test(filename),
            new RegExp('^' + filenameToMatch + '$', 'i').test(filename),
            new RegExp('^' + escapeRegex(slugify(filenameToMatch)), 'i').test(
              filename
            ),
            new RegExp('/' + filenameToMatch + '/', 'gi').test(filepath)
          ]

          //if (/maiden/i.test(o.name)) console.log(regexs, filename);
          //if (/maiden/i.test(o.name)) console.log(regexs.some(Boolean));
          return regexs.some(Boolean)
        })
        .map((loc) => toUnix(loc.path))

      if (location.length > 0) {
        // console.log(mat.name, location)
        location.forEach((loc) => imgFiles.push(loc))
      }
    }
    const imgProcessed: { absolutePath: string; pathname: string }[] = []
    while (imgFiles.length > 0) {
      const img = imgFiles[0]
      const slugname = slugify(basename(img, extname(img)), {
        lower: true,
        trim: true
      })
      const pathname =
        '/' +
        [
          'chimeraland',
          'materials',
          slugify(result.name, { lower: true, trim: true }),
          slugname + '.webp'
        ]
          .join('/')
          .replace(/-chimeraland/g, '')
      // copy images
      const dest = join(publicDir, pathname.replace('/chimeraland/', '/'))
      if (/(-|\s){2,10}|-chimeraland/g.test(dest)) {
        throw new Error('destination image has more hypens or spaces: ' + dest)
      }
      if (!existsSync(dest)) {
        let input: Buffer
        if (isValidHttpUrl(img)) {
          input = await axios
            .get(img, { responseType: 'arraybuffer' })
            .then((response) => {
              return response.data
            })
        } else {
          input = readFileSync(img)
        }
        if (!existsSync(dirname(dest))) {
          mkdirSync(dirname(dest), { recursive: true })
        }
        await sharp(input).webp().toFile(dest)
      }
      imgProcessed.push({ absolutePath: dest, pathname })
      imgFiles.shift()
    }
    result.images = <any>array_unique(imgProcessed, 'pathname')

    return Object.fromEntries(Object.entries(result).sort())
  })
  .then((mapped) => {
    writeFileSync(outputJSON, JSON.stringify(mapped, null, 2))
    console.log('json written', outputJSON)
  })
