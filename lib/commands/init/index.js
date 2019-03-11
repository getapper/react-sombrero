const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const PackageJson = require('../../models/package-json')

process.GLOBAL.CWD = process.cwd()

module.exports = async argv => {
  let dirname = argv._[1]
  process.GLOBAL.PRJ_DIR = path.join(process.GLOBAL.CWD, dirname)

  const packageJson = new PackageJson()

  const gitignore =
`idea
node_modules
package-lock.json`

  if (argv._.length !== 2) {
    console.log(chalk.red('Unexpected number of arguments'))
  } else {
    if (!fs.existsSync(dirname)) {
       fs.mkdirSync(dirname)
    } else {
      console.log(chalk.red('Directory already exists'))
    }

    packageJson.init({
      name: dirname
    })
    packageJson.save()
     fs.writeFileSync(path.join(process.GLOBAL.PRJ_DIR, '.gitignore'), gitignore)
  }
}
