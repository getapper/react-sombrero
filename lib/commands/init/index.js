module.exports = async argv => {
  const chalk = require('chalk')
  const fs = require('fs')
  const path = require('path')

  let dirname = argv._[1]
  let currentDirectory = path.basename(process.cwd());
  let projectDirectory = path.join('./', dirname)

  const packageJson = `{
  "name": "${dirname}",
  "version": "0.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "author": "",
  "license": "ISC"
  }`

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
    fs.writeFileSync(path.join(projectDirectory, 'package.json'), packageJson)
    fs.writeFileSync(path.join(projectDirectory, '.gitignore'), gitignore)
  }
}
