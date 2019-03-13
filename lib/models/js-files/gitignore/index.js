const JsFile = require('..')
const path = require('path')
const fs = require('fs')
const ejs = require('ejs')

class Gitignore extends JsFile {
  constructor(js) {
    super(js)
  }

  init(js) {

    const gitignoreTemplate = fs.readFileSync(
      path.join(__dirname, '../../../templates/gitignore-template.ejs'),
      'ascii'
    )

    this.js = ejs.render(gitignoreTemplate)
  }

  read() {
    super.read('.gitignore')
  }

  save() {
    super.save(path.join(process.GLOBAL.PRJ_DIR + '/.gitignore'))
  }
}

module.exports = Gitignore
