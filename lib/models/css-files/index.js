const {create} = require('../../helpers/files')
const path = require('path')
const fs = require('fs')
const ejs = require('ejs')

class CssFile {
  constructor() {

  }

  read(path) {

  }

  init(templatePath) {
    const cssTemplate = fs.readFileSync(
      path.join(__dirname, `../../templates/${templatePath}`),
      'ascii'
    )

    this.css = ejs.render(cssTemplate)
  }

  save(filePath) {
    create(path.join(process.GLOBAL.PRJ_DIR, filePath), this.css)
  }
}

module.exports = CssFile
