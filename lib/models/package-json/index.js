const JsonFile = require('../json-files')

class PackageJson extends JsonFile {
  constructor (json) {
    super (json)
  }

  read () {
    super.read('package.json')
  }

  save () {
    super.save('package.json')
  }
}
