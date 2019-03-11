const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const PackageJson = require('../../models/package-json')

module.exports = async argv => {
  let dirname = argv._[1]
  let currentDirectory = path.basename(process.cwd());
  let projectDirectory = path.join('./', dirname)

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
    // fs.writeFileSync(path.join(projectDirectory, 'package.json'), packageJson)
    fs.writeFileSync(path.join(projectDirectory, '.gitignore'), gitignore)
  }
}
