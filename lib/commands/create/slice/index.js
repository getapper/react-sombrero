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
const {sliceValidation} = require('../../../models/validations')
const {insertInParent, insertInInitialState, insertInReducers} = require('../../../helpers/insert-in-file')
const CommonJsFile = require('../../../models/js-files/common-js')
const ReduxIndexExport = require('../../../models/js-files/redux-index-export')

module.exports = async () => {
  let dirname = process.cwd()
  process.GLOBAL.PRJ_DIR = dirname
  const directories = new Directories()
  const commonJsFile = new CommonJsFile()
  const reduxIndexExport = new ReduxIndexExport()
  let answer
  let sliceName

  answer = await inquirer
    .prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Insert slice name',
        validate: (input) => {
          return joi.validate(input, sliceValidation, (err, val) => {
            if (err) {
              return 'Slice name must be a valid string'
            } else {
                return true
            }
          })
        }
      }
    ])
  sliceName = answer.name

  if (!fs.existsSync(path.join(dirname, `src/redux/action-types/${sliceName}`))) {
    directories.create(path.join(dirname, `src/redux/action-types/${sliceName}`))
    fs.openSync(`src/redux/action-types/${sliceName}/index.js`, 'w')
    reduxIndexExport.read('action-types')
    reduxIndexExport.write('action-types', sliceName)
    reduxIndexExport.save('action-types')
  }
  if (!fs.existsSync(path.join(dirname, `src/redux/actions/${sliceName}`))) {
    directories.create(path.join(dirname, `src/redux/actions/${sliceName}`))
    fs.openSync(`src/redux/actions/${sliceName}/index.js`, 'w')
    reduxIndexExport.read('actions')
    reduxIndexExport.write('actions', sliceName)
    reduxIndexExport.save('actions')
  }
  if (!fs.existsSync(path.join(dirname, `src/redux/initial-states/${sliceName}`))) {
    directories.create(path.join(dirname, `src/redux/initial-states/${sliceName}`))
    commonJsFile.init('redux/initial-state-template.ejs')
    commonJsFile.save(`src/redux/initial-states/${sliceName}/index.js`)
    insertInInitialState(dirname, sliceName)
  }

  if (!fs.existsSync(path.join(dirname, `src/redux/getters/${sliceName}`))) {
    directories.create(path.join(dirname, `src/redux/getters/${sliceName}`))
    fs.openSync(`src/redux/getters/${sliceName}/index.js`, 'w')
    fs.appendFileSync(path.join(dirname, 'src/redux/getters/index.js'), `export * from './${sliceName}'\n`);
  }

  if (!fs.existsSync(path.join(dirname, `src/redux/reducers/${sliceName}`))) {
    directories.create(path.join(dirname, `src/redux/reducers/${sliceName}`))
    commonJsFile.init('redux/reducer-template.ejs')
    commonJsFile.save(`src/redux/reducers/${sliceName}/index.js`)
    insertInReducers(dirname, sliceName)
  }

  console.log(chalk.green('Slice created!'))
}

