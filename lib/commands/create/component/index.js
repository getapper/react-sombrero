const _ = require('lodash')
const fs = require('fs')
const chalk = require('chalk')
const dirTree = require('directory-tree')
const path = require('path')
const inquirer = require('inquirer')
const joi = require('joi')
const Directories = require('../../../models/directories')
const Components = require('../../../models/js-files/components')
const CssFiles = require('../../../models/css-files')
const {printTree} = require('../../../helpers/print-tree')
const {capitalize} = require('../../../helpers/capitalize')
const {addDirectoriesIndex, indexNamePair} = require('../../../helpers/add-directories-index')
const {sceneNumberValidation, sceneNameValidation} = require('../../../models/validations')

module.exports = async argv => {
  const directories = new Directories()
  const components = new Components()
  const cssFiles = new CssFiles()
  let dirname = process.cwd()
  let tree = dirTree(path.join(dirname, 'scenes'), {extensions: /^[^.]+$/, exclude: /components/})
  let directoryNumber
  let componentName
  let hasRedux = argv.r || argv.redux
  let answers

  if (tree.children.length === 0) {
    console.log(chalk.red('Create the first scene before creating a component'))
    process.exit(1)
  }

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
      }
    ])

  directoryNumber = answers.number
  componentName = answers.name

  components.init(capitalize(_.camelCase(componentName)), hasRedux)
  cssFiles.init('css/base-css-template.ejs')

  if (!fs.existsSync(path.join(indexNamePair[directoryNumber].path, 'components'))) {
    directories.create(path.join(indexNamePair[directoryNumber].path, 'components'))
  }
  directories.create(path.join(indexNamePair[directoryNumber].path, `components/${componentName}`))
  components.save(path.join(indexNamePair[directoryNumber].path, `components/${componentName}`))
  cssFiles.save(path.join(indexNamePair[directoryNumber].path, `components/${componentName}/style.scss`))


  console.log(chalk.green('Component created!'))
}

