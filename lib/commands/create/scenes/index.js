const fs = require('fs')
const chalk = require('chalk')
const dirTree = require('directory-tree')
const path = require('path')
const joi = require('joi')
const inquirer = require('inquirer')
const Directories = require('../../../models/directories')
const Scenes = require('../../../models/js-files/scenes')
const CssFiles = require('../../../models/css-files')
const {printTree, printTreeWithRouter} = require('../../../helpers/print-tree')
const {capitalize} = require('../../../helpers/capitalize')
const {insertInRouter} = require('../../../helpers/insert-in-router')
const _ = require('lodash')
const {addDirectoriesIndex, indexNamePair, addRouterNames} = require('../../../helpers/add-directories-index')
const {sceneNumberValidation, sceneNameValidation, isRouterValidation, routerNameValidation, routerInitAccessValidation} = require('../../../models/validations')

module.exports = async () => {
  const directories = new Directories()
  const scenes = new Scenes()
  const cssFiles = new CssFiles()
  let dirname = process.cwd()
  process.GLOBAL.PRJ_DIR = dirname
  let directoryNumber, isRouter, isRoute, sceneName, answers, routerName, hash, key, initialAccess, routerIndex
  let tree = dirTree(path.join(dirname, 'scenes'), {extensions: /^[^.]+$/, exclude: /components/})

  tree.index = 0
  indexNamePair.push({index: tree.index, path: tree.path, isRouter: true, routerName: 'mainRouter'})

  addDirectoriesIndex(tree, 'scene')

  addRouterNames()

  printTree(tree, "", true, 'scene')

  answers = await inquirer
    .prompt([
      {
        type: 'input',
        name: 'number',
        message: 'Insert directory number',
        validate: (input) => {
          return joi.validate(input, sceneNumberValidation, (err, val) => {
            if (err) {
              return 'Directory number must be a number'
            } else {
              if (!indexNamePair[input] && parseInt(input, 10) !== 0) {
                return 'Directory doesn\'t exists'
              } else {
                return true
              }
            }
          })
        }
      },
      {
        type: 'input',
        name: 'name',
        message: 'Insert new scene name',
        validate: (input) => {
          return joi.validate(input, sceneNameValidation, (err, val) => {
            if (err) {
              return 'Scene name can only contain letters, numbers, \'_\' or \'-\''
            } else {
              return true
            }
          })
        }
      },
      {
        type: 'input',
        name: 'isRouter',
        message: 'Is router? (y/n)',
        validate: (input) => {
          return joi.validate(input, isRouterValidation, (err, val) => {
            if (err) {
              return 'Answer can only be y or n'
            } else {
              return true
            }
          })
        }
      },
      {
        type: 'input',
        name: 'isRoute',
        message: 'Is route? (y/n)',
        validate: (input) => {
          return joi.validate(input, isRouterValidation, (err, val) => {
            if (err) {
              return 'Answer can only be y or n'
            } else {
              return true
            }
          })
        }
      },
    ])

  directoryNumber = parseInt(answers.number, 10)
  sceneName = answers.name
  isRouter = answers.isRouter === 'y'
  isRoute = answers.isRoute === 'y'

  if (isRouter) {
    answers = await inquirer
      .prompt([
        {
          type: 'input',
          name: 'routerName',
          message: 'Insert router name',
          validate: (input) => {
            return joi.validate(input, routerNameValidation, (err, val) => {
              if (err) {
                return 'Scene name can only contain letters, numbers, \'_\' or \'-\''
              } else {
                return true
              }
            })
          }
        }
      ])

    routerName = answers.routerName
  }

  if (isRoute) {

    printTreeWithRouter(tree, "", true, 'scene', indexNamePair)

    answers = await inquirer
      .prompt([
        {
          type: 'input',
          name: 'routerIndex',
          message: 'Insert router index',
          validate: (input) => {
            return joi.validate(input, sceneNumberValidation, (err, val) => {
              if (err) {
                return 'Directory number must be a number'
              } else {
                if (!indexNamePair[input] && parseInt(input, 10) !== 0) {
                  return 'Directory doesn\'t exists'
                } else {
                  if (!indexNamePair[input].isRouter) {
                    return 'This scene is not a Router'
                  } else {
                    return true
                  }
                }
              }
            })
          }
        },
        {
          type: 'input',
          name: 'initialAccess',
          message: 'Insert route initial access (true/false)',
          validate: (input) => {
            return joi.validate(input, routerInitAccessValidation, (err, val) => {
              if (err) {
                return 'Initial access can only be true or false'
              } else {
                return true
              }
            })
          }
        },
        {
          type: 'input',
          name: 'hash',
          message: 'Insert route hash'
        },
        {
          type: 'input',
          name: 'key',
          message: 'Insert route key'
        }
      ])

    initialAccess = answers.initialAccess
    hash = answers.hash
    key = answers.key
    routerIndex = parseInt(answers.routerIndex, 10)
  }

  scenes.init(capitalize(_.camelCase(sceneName)), isRouter, routerName)
  cssFiles.init('css/base-css-template.ejs')

  if (directoryNumber === 0) {
    directories.create(path.join(indexNamePair[directoryNumber].path, sceneName))
    scenes.save(path.join(indexNamePair[directoryNumber].path, sceneName))
    cssFiles.save(path.join(indexNamePair[directoryNumber].path, `${sceneName}/style.scss`))
  } else {
    if (!fs.existsSync(path.join(indexNamePair[directoryNumber].path, 'scenes'))) {
      directories.create(path.join(indexNamePair[directoryNumber].path, 'scenes'))
    }
    directories.create(path.join(indexNamePair[directoryNumber].path, `scenes/${sceneName}`))
    scenes.save(path.join(indexNamePair[directoryNumber].path, `scenes/${sceneName}`))
    cssFiles.save(path.join(indexNamePair[directoryNumber].path, `scenes/${sceneName}/style.scss`))
  }

  if (isRoute) {
    // Insert new route in router
    if (routerIndex === 0) {
      insertInRouter(dirname, sceneName, initialAccess, hash, key, isRouter, dirname, routerName, path.join(indexNamePair[directoryNumber].path, (directoryNumber === 0) ? sceneName : `scenes/${sceneName}`), routerIndex)
    } else {
      insertInRouter(indexNamePair[routerIndex].path, sceneName, initialAccess, hash, key, isRouter, dirname, routerName, path.join(indexNamePair[directoryNumber].path, (directoryNumber === 0) ? sceneName : `scenes/${sceneName}`), routerIndex)
    }
  }
  console.log(chalk.green('Scene created!'))
}

