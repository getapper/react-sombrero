const JsFile = require('..')
const path = require('path')
const fs = require('fs')
const ejs = require('ejs')

class Apis extends JsFile {
  constructor(js) {
    super(js)
  }

  init(js) {
    const apisTemplate = fs.readFileSync(
      path.join(__dirname, '../../../templates/constants/apis-template.ejs'),
      'ascii'
    )

    this.js = ejs.render(apisTemplate)
  }

  read() {
  }

  save() {
    super.save(path.join(process.GLOBAL.PRJ_DIR, 'constants/apis/index.js'))
  }
}

module.exports = Apis
