const JsFile = require('..')
const path = require('path')
const fs = require('fs')
const ejs = require('ejs')
const _ = require('lodash')

class Scenes extends JsFile {
  constructor(js) {
    super(js)
  }

  init(js, isRouter, routerName, isFunctional, useScss, useJss) {
    let sceneTemplate
    if(isFunctional) {
      sceneTemplate = fs.readFileSync(
        path.join(__dirname, '../../../templates/functional-component-template.ejs'),
        'ascii'
      )
      this.js = ejs.render(sceneTemplate, {
        componentName: js,
        isRouter,
        routerName,
        hasRedux: true,
        useScss,
        useJss
      })
    } else {
      sceneTemplate = fs.readFileSync(
        path.join(__dirname, '../../../templates/component-template.ejs'),
        'ascii'
      )
      this.js = ejs.render(sceneTemplate, {
        componentName: js,
        isRouter,
        routerName,
        hasRedux: true,
        useScss,
        useJss
      })
    }
  }

  read(path) {
    return super.read(path)
  }

  save(dirPath) {
    super.save(path.join(dirPath, '/index.js'))
  }
}

module.exports = Scenes
