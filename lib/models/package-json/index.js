const JsonFile = require('../json-files')

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
      "license": "ISC"
    }, json)
  }

  read() {
    super.read('package.json')
  }

  save() {
    super.save('package.json')
  }
}
