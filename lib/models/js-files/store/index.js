const JsFile = require('..')
const path = require('path')
const fs = require('fs')
const ejs = require('ejs')

class Store extends JsFile {
  constructor(js) {
    super(js)
  }

  init(js) {
    const storeTemplate = fs.readFileSync(
      path.join(__dirname, '../../../templates/redux/init/store-template.ejs'),
      'ascii'
    )

    this.js = ejs.render(storeTemplate)
  }

  read() {
    super.read('/redux/store.js')
  }

  save() {
    super.save(path.join(process.GLOBAL.PRJ_DIR, '/redux/store.js'))
  }
}

module.exports = Store
