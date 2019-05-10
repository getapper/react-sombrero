const JsFile = require('..')
const path = require('path')
const fs = require('fs')
const ejs = require('ejs')

class Components extends JsFile {
  constructor(js) {
    super(js)
  }

  init(js, hasRedux, isFunctional) {
    let componentTemplate
    if(hasRedux) {
      if(isFunctional) {
        componentTemplate = fs.readFileSync(
          path.join(__dirname, '../../../templates/functional-redux-component-template.ejs'),
          'ascii'
        )
      } else {
        componentTemplate = fs.readFileSync(
          path.join(__dirname, '../../../templates/redux-component-template.ejs'),
          'ascii'
        )
      }
    } else {
      if(isFunctional) {
        componentTemplate = fs.readFileSync(
          path.join(__dirname, '../../../templates/functional-component-template.ejs'),
          'ascii'
        )
      } else {
        componentTemplate = fs.readFileSync(
          path.join(__dirname, '../../../templates/component-template.ejs'),
          'ascii'
        )
      }
    }

    this.js = ejs.render(componentTemplate, { componentName: js })
  }

  read() {

  }

  save(dirPath) {
    super.save(path.join(dirPath, '/index.js'))
  }
}

module.exports = Components
