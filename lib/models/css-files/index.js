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
    create(filePath, this.css)
  }
}

module.exports = CssFile
