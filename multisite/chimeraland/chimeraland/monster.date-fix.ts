import { writeFileSync } from 'fs'
import moment from 'moment'
import { join } from 'upath'
import monsters from './monsters.json'

const updates: string[] = []
const dates: string[] = []

monsters.data = monsters.data.map((data) => {
  let updated = data.dateModified
  let date = data.datePublished
  while (updates.includes(date)) {
    // add 1 hour to date published
    date = moment(date)
      .add(Math.floor(Math.random() * 10), 'hour')
      .format()
    console.log({ date })
  }
  dates.push(date)
  while (updates.includes(updated)) {
    // add 1 hour to updated
    updated = moment(updated)
      .add(Math.floor(Math.random() * 10), 'hour')
      .format()
    console.log({ updated })
  }
  updates.push(updated)
  return data
})

export function writenow() {
  writeFileSync(
    join(__dirname, 'monsters.json'),
    JSON.stringify(monsters, null, 2)
  )
}
