const JsFile = require('..')
const path = require('path')
const fs = require('fs')
const ejs = require('ejs')

class Index extends JsFile {
  constructor(js) {
    super(js)
  }

  init(js) {

    const indexTemplate = fs.readFileSync(
      path.join(__dirname, '../../../templates/index-template.ejs'),
      'ascii'
    )

    this.js = ejs.render(indexTemplate)
  }

  read() {
    super.read('/index.js')
  }

  save() {
    super.save(path.join(process.GLOBAL.PRJ_DIR, '/index.js'))
  }
}

module.exports = Index
