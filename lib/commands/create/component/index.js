const _ = require('lodash')
const fs = require('fs')
const chalk = require('chalk')
const dirTree = require('directory-tree')
const path = require('path')
const inquirer = require('inquirer')
const Directories = require('../../../models/directories')
const Components = require('../../../models/js-files/components')
const CssFiles = require('../../../models/css-files')
const {printTree} = require('../../../helpers/print-tree')
const {capitalize} = require('../../../helpers/capitalize')
const {addDirectoriesIndex, indexNamePair} = require('../../../helpers/add-directories-index')

module.exports = async argv => {
  const directories = new Directories()
  const components = new Components()
  const cssFiles = new CssFiles()
  let dirname = process.cwd()
  let tree = dirTree(path.join(dirname, 'scenes'), {extensions: /^[^.]+$/, exclude: /components/})
  let directoryNumber = 0
  let componentName = ''
  let hasRedux = argv.r || argv.redux

  if(tree.children.length === 0) {
    console.log(chalk.red('Create the first scene before creating a component'))
    process.exit(1)
  }

  addDirectoriesIndex(tree, 'component')

  printTree(tree, "", true, 'component')

  //@TODO add input validation and format helper text
  await inquirer
    .prompt([
      {
        type: 'input',
        name: 'number',
        message: 'Insert directory number'
      },
      {
        type: 'input',
        name: 'name',
        message: 'Insert new component name'
      }
    ])
    .then(answers => {
      directoryNumber = answers.number
      componentName = answers.name
    })

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

