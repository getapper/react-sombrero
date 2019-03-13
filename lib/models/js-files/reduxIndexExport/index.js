const JsFile = require('..')
const path = require('path')
const fs = require('fs')
const ejs = require('ejs')

class reduxIndexExport extends JsFile {
  constructor(js) {
    super(js)
  }

  init(js) {
    const exportTemplate = fs.readFileSync(
      path.join(__dirname, '../../../templates/export-template.ejs'),
      'ascii'
    )

    this.js = ejs.render(exportTemplate, { path: `./${js}` })
  }

  read() {
  }

  save(exportPath) {
    super.save(path.join(process.GLOBAL.PRJ_DIR + `/redux/${exportPath}/index.js`))
  }
}

module.exports = reduxIndexExport
