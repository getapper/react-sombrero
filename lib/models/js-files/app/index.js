const JsFile = require('..')
const path = require('path')
const fs = require('fs')
const ejs = require('ejs')

class App extends JsFile {
  constructor(js) {
    super(js)
  }

  init(js) {
    const appTemplate = fs.readFileSync(
      path.join(__dirname, '../../../templates/app-template.ejs'),
      'ascii'
    )

    this.js = ejs.render(appTemplate)
  }

  read() {
    super.read('/app.js')
  }

  save() {
    super.save(path.join(process.GLOBAL.PRJ_DIR + '/app.js'))
  }
}

module.exports = App
