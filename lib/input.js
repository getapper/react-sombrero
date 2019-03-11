module.exports = () => {
  const argv = require('minimist')(process.argv.slice(2));
  const path = require('path')
  const fs = require('fs')

  switch(argv._[0]) {
    case 'init':
      if(argv._.length !== 2) {
        console.log('Unexpected number of arguments')
      } else {
        let dirname = argv._[1]
        try {
          if (!fs.existsSync(dirname)){
            fs.mkdirSync(dirname)
          } else {
            console.log('Directory already exists')
          }
        } catch (err) {
          console.error(err)
        }
      }
      break
    default:
      console.log('Command not found')
  }
}
