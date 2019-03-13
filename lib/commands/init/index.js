const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const PackageJson = require('../../models/json-files/package-json')
const Index = require('../../models/js-files/index-js')
const Gitignore = require('../../models/gitignore')
const App = require('../../models/js-files/app')
const Directories = require('../../models/directories')
const Store = require('../../models/js-files/store')
const ReduxIndexExport = require('../../models/js-files/reduxIndexExport')


process.GLOBAL.CWD = process.cwd()

module.exports = async argv => {
  const packageJson = new PackageJson()
  const index = new Index()
  const gitignore = new Gitignore()
  const app = new App()
  const directories = new Directories()
  const store = new Store()
  const reduxIndexExport = new ReduxIndexExport()

  if (argv._.length !== 2) {
    console.log(chalk.red('Unexpected number of arguments'))
  } else {
    let dirname = argv._[1]
    process.GLOBAL.PRJ_DIR = path.join(process.GLOBAL.CWD, dirname)

    // Project directory and basic files

    directories.create(dirname)

    packageJson.init({
      name: dirname
    })
    packageJson.save()

    index.init()
    index.save()

    gitignore.init()
    gitignore.save()

    app.init()
    app.save()

    // Redux

    directories.create(path.join(dirname, 'redux'))

    store.init()
    store.save()

    directories.create(path.join(dirname, 'redux/action-types'))
    directories.create(path.join(dirname, 'redux/actions'))
    directories.create(path.join(dirname, 'redux/initial-states'))
    directories.create(path.join(dirname, 'redux/reducers'))
    directories.create(path.join(dirname, 'redux/sagas'))

    reduxIndexExport.init('global')

    reduxIndexExport.save('action-types')
    reduxIndexExport.save('actions')
    reduxIndexExport.save('initial-states')
    reduxIndexExport.save('reducers')
    reduxIndexExport.save('sagas')

  }
}
