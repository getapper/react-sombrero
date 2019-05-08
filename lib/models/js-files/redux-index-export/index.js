const JsFile = require('..')
const path = require('path')
const fs = require('fs')
const ejs = require('ejs')

class  reduxIndexExport extends JsFile {
  constructor(js) {
    super(js)
  }

  init(js) {
    const exportTemplate = fs.readFileSync(
      path.join(__dirname, '../../../templates/redux/export-template.ejs'),
      'ascii'
    )

    this.js = ejs.render(exportTemplate, { path: `./${js}` })
  }

  read(readPath) {
    const directory = process.GLOBAL.PRJ_DIR ? process.GLOBAL.PRJ_DIR : process.cwd()
    this.js = super.read(path.join(directory, `src/redux/${readPath}/index.js`))
  }

  save(exportPath) {
    let savePath = process.GLOBAL.PRJ_DIR ? process.GLOBAL.PRJ_DIR : process.cwd()
    super.save(path.join(savePath, `src/redux/${exportPath}/index.js`))
  }

  write(writePath, param) {
    const exportTemplate = fs.readFileSync(
      path.join(__dirname, '../../../templates/redux/export-template.ejs'),
      'ascii'
    )
    this.js = this.js.concat(ejs.render(exportTemplate, { path: `./${param}` }))
  }
}

module.exports = reduxIndexExport
