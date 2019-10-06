const chalk = require('chalk')
const fs = require('fs')
const fsExtra = require('fs-extra')
const path = require('path')
const { execSync } = require('child_process')
const inquirer = require('inquirer')
const joi = require('joi')
const { createRootDirectory } = require('../../helpers/create-root-directory')
const PackageJson = require('../../models/json-files/package-json')
const SombreroJson = require('../../models/json-files/sombrero-json')
const Directories = require('../../models/directories')

process.GLOBAL.CWD = process.cwd()

module.exports = async argv => {
  const packageJson = new PackageJson()
  const sombreroJson = new SombreroJson()
  const directories = new Directories()
  let shouldNotInit = argv.noinstall || argv.n

  if (argv._.length !== 2) {
    console.log(chalk.red('Unexpected number of arguments'))
  } else {
    let dirname = argv._[1]
    process.GLOBAL.PRJ_DIR = path.join(process.GLOBAL.CWD, dirname)

    try {
      let answers = await inquirer
        .prompt([
          {
            type: 'input',
            name: 'useScss',
            message: 'Should use SCSS? (y/n)',
            validate: (input) => {
              return joi.validate(input, joi.any().valid('y', 'n'), (err, val) => {
                if (err) {
                  return 'Answer can only be y or n'
                } else {
                  return true
                }
              })
            }
          },
          {
            type: 'input',
            name: 'useJss',
            message: 'Should use JSS? (y/n)',
            validate: (input) => {
              return joi.validate(input, joi.any().valid('y', 'n'), (err, val) => {
                if (err) {
                  return 'Answer can only be y or n'
                } else {
                  return true
                }
              })
            }
          },
        ])

      // Create root project directory
      await createRootDirectory(dirname, directories)

      // Copy all basic files
      await fsExtra.copy(path.join(__dirname, '..', '..', 'templates', 'init'), dirname)

      sombreroJson.init({
        useScss: answers.useScss === 'y',
        useJss: answers.useJss === 'y'
      })
      sombreroJson.save()

      packageJson.init({
        name: dirname
      })
      packageJson.save()

      if(!shouldNotInit) {
        execSync('npm i', {
          cwd: dirname,
          stdio: 'inherit'
        })
      }

      console.log(chalk.green('DONE!'))
    } catch (err) {
      console.log(chalk.red(err))
      process.exit(1)
    }
    process.exit(0)
  }
}
