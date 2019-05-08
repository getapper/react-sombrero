const Scenes = require('../../models/js-files/scenes')
const Directories = require('../../models/directories')
const CommonJsFile = require('../../models/js-files/common-js')
const JsFiles = require('../../models/js-files')
const _ = require('lodash')
const {capitalize} = require('../capitalize')
const ejs = require('ejs')
const path = require('path')
const {create} = require('../../helpers/files')
const fs = require('fs')
const jsFiles = new JsFiles()
const commonJsFile = new CommonJsFile()
const directories = new Directories()
const scenes = new Scenes()

function insertInRouter(routerPath, sceneName, initialAccess, hash, key, isRouter, dirname, routerName, scenePath, routerIndex) {
  const relativePath = path.relative(routerPath, scenePath)
  let file, insertIndex, indentNumber
  let indent = ''
  let insertString = `\nimport ${capitalize(_.camelCase(sceneName))} from '${relativePath[0] !== '.' ? `./${relativePath}` : relativePath}'`
  const routeTemplate = scenes.read(
    path.join(__dirname, '../../templates/js-files/route-template.ejs')
  )

  if(routerIndex === 0) {
    file = scenes.read(path.join(routerPath, 'app.js'))
  } else {
    file = scenes.read(path.join(routerPath, 'index.js'))
  }
  // Insert import
  insertIndex = file.indexOf('\n\n', file.indexOf('// REACT'))
  if (insertIndex === -1) {
    insertIndex = file.indexOf('\r\n\r\n', file.indexOf('// REACT'))
  }

  file = file.slice(0, insertIndex).concat(insertString).concat(file.slice(insertIndex))

  // Insert route
  indentNumber = file.indexOf('routerStatePath') - (file.indexOf('<HashRouter') + 12)

  insertIndex = file.indexOf('</HashRouter>') - (indentNumber - 1)

  for (let i = 0; i < indentNumber; i++) {
    indent = indent.concat(' ')
  }

  const route = ejs.render(routeTemplate, {indent, hash, initialAccess, key, name: capitalize(_.camelCase(sceneName))})

  file = file.slice(0, insertIndex).concat('\n').concat(route).concat(file.slice(insertIndex))

  if(routerIndex === 0){
    create(path.join(routerPath, 'app.js'), file)
  } else {
    create(path.join(routerPath, 'index.js'), file)
  }
}

function insertInRedux(dirname, routerName) {
  let initialStateString = `,\n  ${_.camelCase(routerName)}Router: null`
  const actionTemplate = scenes.read(
    path.join(__dirname, '../../templates/redux/add-access-to-router-action-template.ejs')
  )
  const action = ejs.render(actionTemplate, {capitalizedName: capitalize(_.camelCase(routerName)), name: _.camelCase(routerName)})
  let file, insertIndex

  if (!fs.existsSync(path.join(dirname, 'src/redux/initial-states/routing'))) {
    directories.create(path.join(dirname, 'src/redux/initial-states/routing'))
  }
  if(!fs.existsSync(path.join(dirname, 'src/redux/initial-states/routing/index.js'))) {
    commonJsFile.init('src/redux/init/initial-states-routing-template.ejs')
    commonJsFile.save('src/redux/initial-states/routing/index.js')
  }
  if (!fs.existsSync(path.join(dirname, 'src/redux/actions/routing'))) {
    directories.create(path.join(dirname, 'src/redux/actions/routing'))
  }
  if(!fs.existsSync(path.join(dirname, 'src/redux/actions/routing/index.js'))){
    commonJsFile.init('src/redux/init/actions-routing-template.ejs')
    commonJsFile.save('src/redux/actions/routing/index.js')
  }

  // Add to initial states
  file = jsFiles.read(path.join(dirname, 'src/redux/initial-states/routing/index.js'))
  insertIndex = file.indexOf('})') - 1
  file = file.slice(0, insertIndex).concat(initialStateString).concat(file.slice(insertIndex))
  create(path.join(dirname, 'src/redux/initial-states/routing/index.js'), file)

  // Create action
  file = jsFiles.read(path.join(dirname, 'src/redux/actions/routing/index.js'))
  insertIndex = file.indexOf('\n\n', file.indexOf('export const'))
  if (insertIndex === -1) {
    insertIndex = file.indexOf('\r\n\r\n', file.indexOf('export const'))
  }
  file = file.slice(0, insertIndex).concat(action).concat(file.slice(insertIndex))
  create(path.join(dirname, 'src/redux/actions/routing/index.js'), file)
}

module.exports = {
  insertInRouter,
  insertInRedux
}
