const JsFile = require('..')
const path = require('path')
const fs = require('fs')
const ejs = require('ejs')
const _ = require('lodash')

class Scenes extends JsFile {
  constructor(js) {
    super(js)
  }

  init(js, isRouter, routerName) {
    let sceneTemplate
    if (isRouter) {
      sceneTemplate = fs.readFileSync(
        path.join(__dirname, '../../../templates/router-scene-template.ejs'),
        'ascii'
      )
      this.js = ejs.render(sceneTemplate, { componentName: js, routerName: routerName})

    } else {
      sceneTemplate = fs.readFileSync(
        path.join(__dirname, '../../../templates/redux-component-template.ejs'),
        'ascii'
      )
      this.js = ejs.render(sceneTemplate, { componentName: js })
    }
  }

  read (path) {
    return super.read(path)
  }

  save(dirPath) {
    super.save(path.join(dirPath, '/index.js'))
  }
}

module.exports = Scenes
