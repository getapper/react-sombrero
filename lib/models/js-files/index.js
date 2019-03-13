const { create } = require('../../helpers/files')

class JsFile {
  constructor (js) {
    if (js) {
      this.js = js
    }
  }

  read (path) {

  }

  save (path) {
    create(path, this.js)
  }
}

module.exports = JsFile
