const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const PackageJson = require('../../models/json-files/package-json')
const Index = require('../../models/js-files/index-js')
const Gitignore = require('../../models/js-files/gitignore')
const App = require('../../models/js-files/app')


process.GLOBAL.CWD = process.cwd()

module.exports = async argv => {
  const packageJson = new PackageJson()
  const index = new Index()
  const gitignore = new Gitignore()
  const app = new App()

  if (argv._.length !== 2) {
    console.log(chalk.red('Unexpected number of arguments'))
  } else {
    let dirname = argv._[1]
    process.GLOBAL.PRJ_DIR = path.join(process.GLOBAL.CWD, dirname)

    if (!fs.existsSync(dirname)) {
       fs.mkdirSync(dirname)
    } else {
      console.log(chalk.red('Directory already exists'))
    }

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
  }
}
