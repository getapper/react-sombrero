const JsFile = require('..')
const path = require('path')
const fs = require('fs')
const ejs = require('ejs')

class Scenes extends JsFile {
  constructor(js) {
    super(js)
  }

  init(js) {
    const sceneTemplate = fs.readFileSync(
      path.join(__dirname, '../../../templates/redux-component-template.ejs'),
      'ascii'
    )

    this.js = ejs.render(sceneTemplate, { componentName: js })
  }

  read() {

  }

  save(dirPath) {
    super.save(path.join(dirPath, '/index.js'))
  }
}

module.exports = Scenes
