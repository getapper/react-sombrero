const _ = require('lodash')
const fs = require('fs')
const chalk = require('chalk')
const dirTree = require('directory-tree')
const path = require('path')
const inquirer = require('inquirer')
const joi = require('joi')
const SombreroJson = require('../../../models/json-files/sombrero-json')
const Directories = require('../../../models/directories')
const Components = require('../../../models/js-files/components')
const CssFiles = require('../../../models/css-files')
const {printTree} = require('../../../helpers/print-tree')
const {capitalize} = require('../../../helpers/capitalize')
const {addDirectoriesIndex, indexNamePair} = require('../../../helpers/add-directories-index')
const {sceneNumberValidation, sceneNameValidation, isFunctionalValidation} = require('../../../models/validations')
const {insertInParent} = require('../../../helpers/insert-in-file')

module.exports = async argv => {
  let dirname = process.cwd()
  process.GLOBAL.PRJ_DIR = dirname
  const sombreroJson = new SombreroJson()
  const directories = new Directories()
  const components = new Components()
  const cssFiles = new CssFiles()
  let tree = dirTree(path.join(dirname, 'src/scenes'), {extensions: /^[^.]+$/, exclude: /components/})
  let directoryNumber, componentName, isFunctional
  let hasRedux = !(argv.nr || argv.noredux)
  let answers

  if (tree === null) {
    console.log(chalk.red('Component can only be created in a valid project directory'))
    process.exit(1)
  }

  tree.index = 0
  indexNamePair.push({index: tree.index, path: tree.path})

  sombreroJson.read()

  addDirectoriesIndex(tree, 'component')

  printTree(tree, "", true, 'component')

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
        message: 'Insert new component name',
        validate: (input) => {
          return joi.validate(input, sceneNameValidation, (err, val) => {
            if (err) {
              return 'Component name can only contain letters, numbers, \'_\' or \'-\''
            } else {
              return true
            }
          })
        }
      },
      {
        type: 'input',
        name: 'isFunctional',
        message: 'Is functional component? (y/n)',
        validate: (input) => {
          return joi.validate(input, isFunctionalValidation, (err, val) => {
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
  componentName = answers.name
  isFunctional = answers.isFunctional === 'y'

  const {
    useScss,
    useJss
  } = sombreroJson.json

  components.init(capitalize(_.camelCase(componentName)), hasRedux, isFunctional, useScss, useJss)

  let basePath
  if (directoryNumber === 0) {
    if (!fs.existsSync(path.join(dirname, 'src/components'))) {
      directories.create(path.join(dirname, 'src/components'))
    }
    basePath = path.join(dirname, `src/components/${componentName}`)
  } else {
    if (!fs.existsSync(path.join(indexNamePair[directoryNumber].path, 'components'))) {
      directories.create(path.join(indexNamePair[directoryNumber].path, 'components'))
    }
    basePath = path.join(indexNamePair[directoryNumber].path, `components/${componentName}`)
    insertInParent(indexNamePair[directoryNumber].path, componentName)
  }
  directories.create(basePath)
  components.save(basePath)
  if (useScss) {
    cssFiles.init('css/base-css-template.ejs')
    cssFiles.save(path.join(basePath, `/style.scss`))
  }
  if (useJss) {
    cssFiles.init('css/base-style-js-template.ejs')
    cssFiles.save(path.join(basePath, `/style.js`))
  }

  console.log(chalk.green('Component created!'))
}

