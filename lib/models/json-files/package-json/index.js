const JsonFile = require('..')
const path = require('path')

class PackageJson extends JsonFile {
  constructor(json) {
    super(json)
  }

  init(json) {
    this.json = Object.assign({}, {
      "version": "0.0.0",
      "description": "",
      "main": "index.js",
      "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
      },
      "author": "",
      "license": "ISC",
      "devDependencies": {
        "react": "16.4.0",
        "react-dom": "16.4.0",
        "react-hot-loader": "4.6.3",
        "react-redux": "5.0.7"
      }
    }, json)
  }

  read() {
    super.read('/package.json')
  }

  save() {
    super.save(path.join(process.GLOBAL.PRJ_DIR + '/package.json'))
  }
}

module.exports = PackageJson
