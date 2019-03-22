const fs = require('fs')
const chalk = require('chalk')
const dirTree = require('directory-tree')
const path = require('path')
const inquirer = require('inquirer')
const Directories = require('../../../models/directories')
const Scenes = require('../../../models/js-files/scenes')
const CssFiles = require('../../../models/css-files')
const { printTree } = require('../../../helpers/print-tree')
const { capitalize } = require('../../../helpers/capitalize')
const _ = require('lodash')
const { addDirectoriesIndex, indexNamePair } = require('../../../helpers/add-directories-index')

module.exports = async () => {
  const directories = new Directories()
  const scenes = new Scenes()
  const cssFiles = new CssFiles()
  let dirname = process.cwd()
  let tree = dirTree(path.join(dirname, 'scenes'), {extensions: /^[^.]+$/, exclude: /components/})
  let directoryNumber = 0
  let sceneName = ''

  tree.index = 0
  indexNamePair.push({index: tree.index, path: tree.path})

  addDirectoriesIndex(tree, 'scene')

  printTree(tree, "", true, 'scene')

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
        message: 'Insert new scene name'
      }
    ])
    .then(answers => {
      directoryNumber = answers.number
      sceneName = answers.name
    })

  scenes.init(capitalize(_.camelCase(sceneName)))
  cssFiles.init('css/base-css-template.ejs')

  if(parseInt(directoryNumber, 10) === 0) {
    directories.create(path.join(indexNamePair[directoryNumber].path, sceneName))
    scenes.save(path.join(indexNamePair[directoryNumber].path, sceneName))
    cssFiles.save(path.join(indexNamePair[directoryNumber].path, `${sceneName}/style.scss`))
  } else {
    if(!fs.existsSync(path.join(indexNamePair[directoryNumber].path, 'scenes'))) {
      directories.create(path.join(indexNamePair[directoryNumber].path, 'scenes'))
    }
    directories.create(path.join(indexNamePair[directoryNumber].path, `scenes/${sceneName}`))
    scenes.save(path.join(indexNamePair[directoryNumber].path, `scenes/${sceneName}`))
    cssFiles.save(path.join(indexNamePair[directoryNumber].path, `scenes/${sceneName}/style.scss`))
  }

  console.log(chalk.green('Scene created!'))
}

