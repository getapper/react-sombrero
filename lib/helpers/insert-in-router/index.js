const Scenes = require('../../models/js-files/scenes')
const JsFiles = require('../../models/js-files')
const _ = require('lodash')
const {capitalize} = require('../capitalize')
const ejs = require('ejs')
const path = require('path')
const {create} = require('../../helpers/files')


function insertInRouter(filePath, sceneName, initialAccess, hash, key, isRouter, dirname, routerName) {
  const scenes = new Scenes()
  const jsFiles = new JsFiles()
  let file, insertIndex, file2
  let insertString = `\nimport ${capitalize(_.camelCase(sceneName))} from './scenes/${sceneName}'`
  let initialStateString = `,\n  ${_.camelCase(routerName)}Router: null`
  const routeTemplate = scenes.read(
    path.join(__dirname, '../../templates/js-files/route-template.ejs')
  )
  const route = ejs.render(routeTemplate, {hash, initialAccess, key, name: capitalize(_.camelCase(sceneName))})

  const actionTemplate = scenes.read(
    path.join(__dirname, '../../templates/redux/add-access-to-router-action-template.ejs')
  )

  const action = ejs.render(actionTemplate, {capitalizedName: capitalize(_.camelCase(routerName)), name: _.camelCase(routerName)})

  file = scenes.read(filePath)

  // Insert import
  insertIndex = file.indexOf('\n\n', file.indexOf('// REACT'))

  file = file.slice(0, insertIndex).concat(insertString).concat(file.slice(insertIndex))

  // Insert route
  insertIndex = file.indexOf('</HashRouter>') - 1

  file = file.slice(0, insertIndex).concat(route).concat(file.slice(insertIndex))

  create(path.join(filePath), file)

  // if router, add to initial states and create action to update access
  if(isRouter) {

    // Add to initial states
    file = jsFiles.read(path.join(dirname, 'redux/initial-states/routing/index.js'))
    insertIndex = file.indexOf('})') - 1
    file = file.slice(0, insertIndex).concat(initialStateString).concat(file.slice(insertIndex))
    create(path.join(dirname, 'redux/initial-states/routing/index.js'), file)

    // Create action
    file = jsFiles.read(path.join(dirname, 'redux/actions/routing/index.js'))
    insertIndex = file.indexOf('\n\n', file.indexOf('export const'))
    file = file.slice(0, insertIndex).concat(action).concat(file.slice(insertIndex))
    create(path.join(dirname, 'redux/actions/routing/index.js'), file)

  }
}

module.exports = {
  insertInRouter
}
