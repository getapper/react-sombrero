module.exports = () => {
  const argv = require('minimist')(process.argv.slice(2))
  const chalk = require('chalk')

  switch(argv._[0]) {
    case 'init':
      require('./commands/init')(argv)
      break
    case 'help':
      require('./commands/help')(argv)
      break
    case 'create':
      require('./commands/create')(argv)
      break
    case 'ajax':
      require('./commands/generate-ajax')(argv)
      break
    case 'errors':
      require('./commands/generate-error-labels')(argv)
      break
    default:
      console.log(chalk.red('Command not found'))
      require('./commands/help')()
  }
}
