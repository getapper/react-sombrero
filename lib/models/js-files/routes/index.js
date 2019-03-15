const JsFile = require('..')
const path = require('path')
const fs = require('fs')
const ejs = require('ejs')

class Routes extends JsFile {
  constructor(js) {
    super(js)
  }

  init(js) {
    const routesTemplate = fs.readFileSync(
      path.join(__dirname, '../../../templates/constants/routes-template.ejs'),
      'ascii'
    )

    this.js = ejs.render(routesTemplate)
  }

  read() {
  }

  save() {
    super.save(path.join(process.GLOBAL.PRJ_DIR, 'constants/routes/index.js'))
  }
}

module.exports = Routes
