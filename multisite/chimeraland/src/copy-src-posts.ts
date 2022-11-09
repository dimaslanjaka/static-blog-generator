import GulpClient from 'gulp'
import { join } from 'upath'
import { hexoProject } from '../project'

const srcPostFolder = join(__dirname, '../src-posts')
const srcPostOutputFolder = join(hexoProject, 'src-posts/chimeraland')

export default function copySrcPost() {
  return GulpClient.src(['**/*.*'], { cwd: srcPostFolder }).pipe(
    GulpClient.dest(srcPostOutputFolder)
  )
}
