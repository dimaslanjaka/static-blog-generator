const Authenticator = require('./Authenticator.js')
const { google } = require('googleapis')
const fs = require('fs').promises
const path = require('path')

Authenticator.authenticate().then((oAuth) => {
  const drive = google.drive({
    version: 'v3',
    auth: oAuth
  })
})

async function listLocalFiles(localPath) {
  try {
    await fs.access(localPath)
  } catch (e) {
    //directory does not even exist yet
    return []
  }

  let files = []

  const dirFiles = await fs.readdir(localPath)
  for (let i = 0; i < dirFiles.length; i++) {
    const fullPath = path.join(localPath, dirFiles[i])
    const isFolder = (await fs.stat(fullPath)).isDirectory()

    if (isFolder) {
      files = files.concat(await listLocalFiles(fullPath))
    } else {
      files.push(fullPath)
    }
  }

  return files
}

module.exports = {
  listLocalFiles
}
