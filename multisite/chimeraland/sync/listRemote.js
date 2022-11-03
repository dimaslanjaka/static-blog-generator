const Authenticator = require('./Authenticator.js')
const { google } = require('googleapis')
const bluebird = require('bluebird')

function listRemote(folderPath) {
  return new bluebird((resolveList) => {
    Authenticator.authenticate().then((oAuth) => {
      const drive = google.drive({
        version: 'v3',
        auth: oAuth
      })
      this.drive = drive
      getRemoteFolderID
        .bind(this)(folderPath)
        .then((fileId) => {
          drive.files.list(
            {
              includeRemoved: false,
              spaces: 'drive',
              fileId: fileId,
              fields:
                'nextPageToken, files(id, name, parents, mimeType, modifiedTime)',
              q: `'${fileId}' in parents`
            },
            function (err, response) {
              if (!err) {
                resolveList(response.data)
              }
            }
          )
        })
    })
  })
}

async function getRemoteFolderID(folderPath) {
  const aLevel = folderPath.split('/')
  let currentParentID = 'root' //start searching the folder at root
  let i = 0

  while (i < aLevel.length) {
    const aConditions = [
      "mimeType = 'application/vnd.google-apps.folder'",
      `'${currentParentID}' in parents`,
      `name = '${aLevel[i]}'`
    ]

    const response = await this.drive.files.list({
      pageSize: 1,
      q: aConditions.join(' and ')
    })

    if (response.data.files.length === 0) {
      throw new Error('Folder not found')
    }

    currentParentID = response.data.files[0].id
    i++
  }

  return currentParentID
}

module.exports = {
  getRemoteFolderID,
  listRemote
}
