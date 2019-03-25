const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const PackageJson = require('../../models/json-files/package-json')
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

module.exports = argv => {
  const packageJson = new PackageJson()
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
  const apis = new Apis()
  const routes = new Routes()
  let shouldInit = argv.no-install || argv.ni

  if (argv._.length !== 2) {
    console.log(chalk.red('Unexpected number of arguments'))
  } else {
    let dirname = argv._[1]
    process.GLOBAL.PRJ_DIR = path.join(process.GLOBAL.CWD, dirname)

    try {

      // Project directory and basic files

      directories.create(dirname)

      packageJson.init({
        name: dirname
      })
      packageJson.save()

      indexJs.init()
      indexJs.save()

      gitignore.init()
      gitignore.save()

      app.init()
      app.save()

      directories.create(path.join(dirname, 'assets'))
      directories.create(path.join(dirname, 'components'))
      directories.create(path.join(dirname, 'configs'))
      directories.create(path.join(dirname, 'constants'))
      directories.create(path.join(dirname, 'css'))
      directories.create(path.join(dirname, 'scenes'))
      directories.create(path.join(dirname, 'scripts'))
      directories.create(path.join(dirname, 'services'))
      directories.create(path.join(dirname, 'redux'))

      // Assets

      directories.create(path.join(dirname, 'assets/public'))
      directories.create(path.join(dirname, 'assets/public/css'))

      cssFile.init('reset-css-template.ejs')
      cssFile.save(path.join(process.GLOBAL.PRJ_DIR, 'assets/public/css/reset.css'))

      indexHtml.init()
      indexHtml.save()

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

      directories.create(path.join(dirname, 'constants/apis'))
      directories.create(path.join(dirname, 'constants/translations'))
      directories.create(path.join(dirname, 'constants/routes'))

      apis.init()
      apis.save()

      routes.init()
      routes.save()

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

      // Services

      directories.create(path.join(dirname, 'services/language'))

      commonJsFile.init('language-template.ejs')
      commonJsFile.save('services/language/index.js')

      commonJsFile.init('createI18n-template.ejs')
      commonJsFile.save('services/createI18n.js')

      // Redux

      store.init()
      store.save()

      directories.create(path.join(dirname, 'redux/action-types'))
      directories.create(path.join(dirname, 'redux/actions'))
      directories.create(path.join(dirname, 'redux/initial-states'))
      directories.create(path.join(dirname, 'redux/reducers'))
      directories.create(path.join(dirname, 'redux/sagas'))

      directories.create(path.join(dirname, 'redux/action-types/global'))
      directories.create(path.join(dirname, 'redux/actions/global'))
      directories.create(path.join(dirname, 'redux/initial-states/global'))
      directories.create(path.join(dirname, 'redux/reducers/global'))

      directories.create(path.join(dirname, 'redux/action-types/auth'))
      directories.create(path.join(dirname, 'redux/actions/auth'))
      directories.create(path.join(dirname, 'redux/initial-states/auth'))
      directories.create(path.join(dirname, 'redux/reducers/auth'))

      reduxIndexExport.init('global')

      reduxIndexExport.save('action-types')
      reduxIndexExport.save('actions')

      reduxIndexExport.read('action-types')
      reduxIndexExport.write('action-types','auth')
      reduxIndexExport.save('action-types')

      reduxIndexExport.read('actions')
      reduxIndexExport.write('actions','auth')
      reduxIndexExport.save('actions')

      commonJsFile.init('redux/init/reducers-index-template.ejs')
      commonJsFile.save('redux/reducers/index.js')

      commonJsFile.init('redux/init/initial-states-index-template.ejs')
      commonJsFile.save('redux/initial-states/index.js')

      // Redux action-types

      reduxConstExport.init('UPDATE_AJAX_LOADING')
      reduxConstExport.save('action-types/global')

      reduxConstExport.init('AUTHENTICATION_EXPIRED')
      reduxConstExport.save('action-types/auth')

      //@TODO All those are hardcoded, could be parameterized in the future

      commonJsFile.init('redux/init/actions-global-template.ejs')
      commonJsFile.save('redux/actions/global/index.js')

      commonJsFile.init('redux/init/actions-auth-template.ejs')
      commonJsFile.save('redux/actions/auth/index.js')

      commonJsFile.init('redux/init/initial-states-global-template.ejs')
      commonJsFile.save('redux/initial-states/global/index.js')

      commonJsFile.init('redux/init/initial-states-auth-template.ejs')
      commonJsFile.save('redux/initial-states/auth/index.js')

      commonJsFile.init('redux/init/reducers-global-template.ejs')
      commonJsFile.save('redux/reducers/global/index.js')

      commonJsFile.init('redux/init/reducers-auth-template.ejs')
      commonJsFile.save('redux/reducers/auth/index.js')

      // Redux saga

      directories.create(path.join(dirname, 'redux/sagas/ajax'))

      commonJsFile.init('redux/init/sagas-index-template.ejs')
      commonJsFile.save('redux/sagas/index.js')

      commonJsFile.init('redux/init/sagas-request-template.ejs')
      commonJsFile.save('redux/sagas/ajax/request.js')

      execSync('npm i', {
        cwd: dirname,
        stdio: 'inherit'
      })

      console.log(chalk.green('DONE!'))
    } catch (err) {
      console.log(chalk.red(err))
      process.exit(1)
    }
    process.exit(0)
  }
}
