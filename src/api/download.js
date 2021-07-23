import fetch from 'node-fetch'
import FileType from 'file-type'
import JSZip from 'jszip'

// Simulates a database result
import dbResult from '../dbResult'

export default function (req, res, next) {

  let hasError, total = 0

  const zip = new JSZip()
  const downloadName = dbResult.zipAs || 'download'
  const folder = zip.folder(downloadName)

  dbResult.images.forEach((url, index) => {

    fetch(dbResult.images[index]).then(async (file) => {

      if (hasError) return

      if (!file.ok) {
        throw Object.assign(Error('Fetch Error: ' + file.url), {status: file.status})
      }

      const buffer = await file.buffer()
      const data = await FileType.fromBuffer(buffer)
      const filename = 'photo_' + (index + 1) + '.' + data.ext

      folder.file(filename, buffer)

      total++

      if (total === dbResult.images.length) {

        const download = await zip.generateAsync({
          type: 'nodebuffer',
          compression: 'DEFLATE'
        })

        res.set('Content-disposition', 'attachment; filename=' + downloadName + '.zip')
        res.set('Content-Type', 'application/zip')

        res.end(download)

      }

    }).catch((err) => {
      hasError = true
      return next(err)
    })

  })

}