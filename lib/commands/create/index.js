const chalk = require('chalk')

module.exports = argv => {
  if (argv._.length !== 2) {
    console.log(chalk.red('Unexpected number of arguments, try sombrero create component or sombrero create scene'))
  } else {
    switch(argv._[1]) {
      case 'component':
        require('./component')(argv)
        break
      case 'scene':
        require('./scenes')()
        break
      case 'slice':
        require('./slice')()
        break
      default:
        console.log(chalk.red('Unexpected parameter, try sombrero create component or sombrero create scene'))
    }
  }
}
