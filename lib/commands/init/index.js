const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const inquirer = require('inquirer')
const joi = require('joi')
const { createRootDirectory } = require('../../helpers/create-root-directory')
const { createFavicon } = require('../../helpers/create-favicon')
const PackageJson = require('../../models/json-files/package-json')
const SombreroJson = require('../../models/json-files/sombrero-json')
const JsonFile = require('../../models/json-files')
const IndexJs = require('../../models/js-files/index-js')
const Gitignore = require('../../models/gitignore')
const App = require('../../models/js-files/app')
const Directories = require('../../models/directories')
const Store = require('../../models/js-files/store')
const ReduxIndexExport = require('../../models/js-files/redux-index-export')
const ReduxConstExport = require('../../models/js-files/redux-const-export')
const CssFile = require('../../models/css-files')
const CommonJsFile = require('../../models/js-files/common-js')
const IndexHtml = require('../../models/index-html')
const Apis = require('../../models/js-files/apis')
const Routes = require('../../models/js-files/routes')


process.GLOBAL.CWD = process.cwd()

module.exports = async argv => {
  const packageJson = new PackageJson()
  const sombreroJson = new SombreroJson()
  const jsonFile = new JsonFile()
  const indexJs = new IndexJs()
  const gitignore = new Gitignore()
  const app = new App()
  const directories = new Directories()
  const store = new Store()
  const reduxIndexExport = new ReduxIndexExport()
  const reduxConstExport = new ReduxConstExport()
  const cssFile = new CssFile()
  const indexHtml = new IndexHtml()
  const commonJsFile = new CommonJsFile()
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

      // Project directory and basic files

      await createRootDirectory(dirname, directories)

      sombreroJson.init({
        useScss: answers.useScss === 'y',
        useJss: answers.useJss === 'y'
      })
      sombreroJson.save()

      packageJson.init({
        name: dirname
      })
      packageJson.save()

      jsonFile.init('eslintrc-template.ejs')
      jsonFile.save(path.join(dirname, '.eslintrc.json'))

      indexJs.init()
      indexJs.save()

      gitignore.init()
      gitignore.save()

      directories.create(path.join(dirname, 'src'))

      app.init()
      app.save()

      directories.create(path.join(dirname, 'src/components'))
      directories.create(path.join(dirname, 'src/css'))
      directories.create(path.join(dirname, 'src/scenes'))
      directories.create(path.join(dirname, 'src/services'))
      directories.create(path.join(dirname, 'src/redux'))
      directories.create(path.join(dirname, 'assets'))
      directories.create(path.join(dirname, 'configs'))
      directories.create(path.join(dirname, 'constants'))
      directories.create(path.join(dirname, 'scripts'))

      directories.create(path.join(dirname, 'src/themes'))
      commonJsFile.init('js-files/themes-template.ejs')
      commonJsFile.save('src/themes/index.js')

      // Assets

      directories.create(path.join(dirname, 'assets/public'))
      directories.create(path.join(dirname, 'assets/public/css'))

      cssFile.init('reset-css-template.ejs')
      cssFile.save(path.join(process.GLOBAL.PRJ_DIR, 'assets/public/css/reset.css'))

      indexHtml.init()
      indexHtml.save()

      await createFavicon()

      // Components

      directories.create(path.join(dirname, 'src/components/form'))
      commonJsFile.init('js-files/form-template.ejs')
      commonJsFile.save('src/components/form/index.js')

      // Configs

      commonJsFile.init('configs/env-template.ejs')
      commonJsFile.save('configs/env.js')

      commonJsFile.init('configs/paths-template.ejs')
      commonJsFile.save('configs/paths.js')

      commonJsFile.init('configs/polyfills-template.ejs')
      commonJsFile.save('configs/polyfills.js')

      commonJsFile.init('configs/webpack-config-dev-template.ejs')
      commonJsFile.save('configs/webpack.config.dev.js')

      commonJsFile.init('configs/webpack-config-prod-template.ejs')
      commonJsFile.save('configs/webpack.config.prod.js')

      // Constants

      directories.create(path.join(dirname, 'constants/translations'))

      //@TODO Make translation dynamic and not hardcoded and create own models

      commonJsFile.init('constants/translations-en-template.ejs')
      commonJsFile.save('constants/translations/en.js')

      commonJsFile.init('constants/translations-it-template.ejs')
      commonJsFile.save('constants/translations/it.js')

      commonJsFile.init('constants/translations-index-template.ejs')
      commonJsFile.save('constants/translations/index.js')

      commonJsFile.init('constants/translations-keys-template.ejs')
      commonJsFile.save('constants/translations/keys.js')


      // Scripts

      commonJsFile.init('start-script-template.ejs')
      commonJsFile.save('scripts/start.js')

      commonJsFile.init('build-script-template.ejs')
      commonJsFile.save('scripts/build.js')

      // Services

      directories.create(path.join(dirname, 'src/services/language'))

      commonJsFile.init('language-template.ejs')
      commonJsFile.save('src/services/language/index.js')

      commonJsFile.init('createI18n-template.ejs')
      commonJsFile.save('src/services/createI18n.js')

      commonJsFile.init('env-template.ejs')
      commonJsFile.save('src/services/env.js')

      // Redux

      store.init()
      store.save()

      directories.create(path.join(dirname, 'src/redux/action-types'))
      directories.create(path.join(dirname, 'src/redux/actions'))
      directories.create(path.join(dirname, 'src/redux/initial-states'))
      directories.create(path.join(dirname, 'src/redux/reducers'))
      directories.create(path.join(dirname, 'src/redux/sagas'))
      directories.create(path.join(dirname, 'src/redux/getters'))

      directories.create(path.join(dirname, 'src/redux/action-types/ajax'))
      directories.create(path.join(dirname, 'src/redux/actions/ajax'))

      directories.create(path.join(dirname, 'src/redux/action-types/auth'))
      directories.create(path.join(dirname, 'src/redux/actions/auth'))
      directories.create(path.join(dirname, 'src/redux/initial-states/auth'))
      directories.create(path.join(dirname, 'src/redux/reducers/auth'))

      directories.create(path.join(dirname, 'src/redux/action-types/global'))
      directories.create(path.join(dirname, 'src/redux/actions/global'))
      directories.create(path.join(dirname, 'src/redux/initial-states/global'))
      directories.create(path.join(dirname, 'src/redux/reducers/global'))
      directories.create(path.join(dirname, 'src/redux/getters/global'))

      directories.create(path.join(dirname, 'src/redux/initial-states/routing'))
      directories.create(path.join(dirname, 'src/redux/reducers/routing'))
      directories.create(path.join(dirname, 'src/redux/actions/routing'))

      reduxIndexExport.init('global')

      reduxIndexExport.save('action-types')
      reduxIndexExport.save('actions')
      reduxIndexExport.save('getters')

      reduxIndexExport.read('action-types')
      reduxIndexExport.write('action-types','auth')
      reduxIndexExport.save('action-types')

      reduxIndexExport.read('actions')
      reduxIndexExport.write('actions','auth')
      reduxIndexExport.save('actions')

      commonJsFile.init('empty-template.ejs')
      commonJsFile.save('src/redux/getters/global/index.js')

      commonJsFile.init('redux/init/reducers-index-template.ejs')
      commonJsFile.save('src/redux/reducers/index.js')

      commonJsFile.init('redux/init/initial-states-index-template.ejs')
      commonJsFile.save('src/redux/initial-states/index.js')

      // Redux action-types

      reduxConstExport.init('UPDATE_AJAX_LOADING')
      reduxConstExport.save('action-types/global')

      reduxConstExport.init('AUTHENTICATION_EXPIRED')
      reduxConstExport.save('action-types/auth')

      commonJsFile.init('empty-template.ejs')
      commonJsFile.save('src/redux/action-types/ajax/index.js')

      //@TODO All those are hardcoded, could be parameterized in the future

      commonJsFile.init('redux/init/actions-global-template.ejs')
      commonJsFile.save('src/redux/actions/global/index.js')

      commonJsFile.init('redux/init/actions-auth-template.ejs')
      commonJsFile.save('src/redux/actions/auth/index.js')

      commonJsFile.init('redux/init/actions-routing-template.ejs')
      commonJsFile.save('src/redux/actions/routing/index.js')

      commonJsFile.init('empty-template.ejs')
      commonJsFile.save('src/redux/actions/ajax/index.js')

      commonJsFile.init('redux/init/initial-states-global-template.ejs')
      commonJsFile.save('src/redux/initial-states/global/index.js')

      commonJsFile.init('redux/init/initial-states-auth-template.ejs')
      commonJsFile.save('src/redux/initial-states/auth/index.js')

      commonJsFile.init('redux/init/initial-states-routing-template.ejs')
      commonJsFile.save('src/redux/initial-states/routing/index.js')

      commonJsFile.init('redux/init/reducers-global-template.ejs')
      commonJsFile.save('src/redux/reducers/global/index.js')

      commonJsFile.init('redux/init/reducers-routing-template.ejs')
      commonJsFile.save('src/redux/reducers/routing/index.js')

      commonJsFile.init('redux/init/reducers-auth-template.ejs')
      commonJsFile.save('src/redux/reducers/auth/index.js')

      // Redux saga

      directories.create(path.join(dirname, 'src/redux/sagas/ajax'))

      commonJsFile.init('redux/init/sagas-index-template.ejs')
      commonJsFile.save('src/redux/sagas/index.js')

      commonJsFile.init('redux/init/sagas-request-template.ejs')
      commonJsFile.save('src/redux/sagas/ajax/request.js')

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
