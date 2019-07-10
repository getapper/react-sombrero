const { create, read } = require('../../helpers/files')
const fs = require('fs')
const path = require('path')
const ejs = require('ejs')

class JsonFile {
  constructor (json) {
    if (json) {
      this.json = json
    }
  }

  read (jsonPath) {
    this.json = require(jsonPath)
  }

  init(templatePath) {
    const template = fs.readFileSync(
      path.join(__dirname, `../../templates/${templatePath}`),
      'ascii'
    )

    this.json = ejs.render(template)
  }

  save (path, isPackageJSON) {
    create(path, isPackageJSON ? JSON.stringify(this.json, null, "\t") : this.json)
  }
}

module.exports = JsonFile
