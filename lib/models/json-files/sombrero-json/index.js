const JsonFile = require('..')
const path = require('path')

class SombreroJson extends JsonFile {
  constructor(json) {
    super(json)
  }

  init(json) {
    this.json = Object.assign({}, json)
  }

  read() {
    console.log(process.GLOBAL.PRJ_DIR)
    super.read(path.join(process.GLOBAL.PRJ_DIR, '/.sombrero.json'))
  }

  save() {
    super.save(path.join(process.GLOBAL.PRJ_DIR, '/.sombrero.json'), true)
  }
}

module.exports = SombreroJson
