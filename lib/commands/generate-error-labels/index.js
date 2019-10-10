const chalk = require('chalk')
const _ = require('lodash')
const path = require('path')
const fs = require('fs')

module.exports = argv => {
  const dirname = process.cwd()
  let errorCodes
  let errorCodesLabels
  try {
    errorCodes = require(path.join(dirname, 'constants', 'client-errors-codes.json'))
  } catch (err) {
    console.log(chalk.red('Error labels generation requires a valid client-errors-codes.json file in constants directory'))
    process.exit(1)
  }
  if (fs.existsSync(path.join(dirname, 'constants', 'client-errors-codes-labels.json'))) {
    errorCodesLabels = require(path.join(dirname, 'constants', 'client-errors-codes-labels.json'))
  } else {
    errorCodesLabels = {}
  }
  Object.keys(errorCodes).forEach(key => {
    if(key !== 'INTERNAL') {
      Object.keys(errorCodes[key]).forEach(k => {
        if(k !== 'VALIDATION_ERROR')
          if(!errorCodesLabels.hasOwnProperty(errorCodes[key][k])) {
            errorCodesLabels[errorCodes[key][k]] = ''
          }
      })
    }
  })
  fs.writeFileSync((path.join(dirname, 'constants', 'client-errors-codes-labels.json')), JSON.stringify(errorCodesLabels, null, 2))

  console.log(chalk.green('DONE! Error labels created'))
  process.exit(0)
}
