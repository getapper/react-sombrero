const chalk = require('chalk')
const _ = require('lodash')

module.exports = argv => {
  if(!_.get(argv, '_.1', false)) {
    console.log(
`
Usage: sombrero [command] [arguments] [options]

Commands:
help                        Show this help
init [name]                 Init new project with the specified name 
create [type]               Create new scene or component
ajax                        Create actions and action-types
help [command]              Show help on [command]
`
    )
  } else {
    switch(argv._[1]) {
      case 'init':
        console.log(
`
NAME
        sombrero-init - Create a react project ready to use
USAGE
        sombrero init [project name]
OPTIONS
        [--noinstall | -n] Creates project and doesn't run npm i
DESCRIPTION
        Create a react project with webpack dev and production configs,
        redux, translations and structured folders scenes and components.
        Runs npm i after project creation
        `
        )
        break
      case 'create':
        console.log(
`
NAME
        sombrero-create - Create a new scene or component
USAGE
        sombrero create [scene|component]
OPTIONS
        component
                  [--redux | -r] Connects component to redux
DESCRIPTION
        Prints the scenes directory tree, omitting components and assigning a number to each scene.
        Asks for the directory number that will contain the new component or scene and the new 
        component or scene name.
        
        Each scene is contained within the ${chalk.underline('scenes')} directory of the parent scene
        and each component is contained within the ${chalk.underline('components')} directory of the
        parent scene.
        
        Scenes and components directories are automatically created if they don't exist.
        
        By default scenes are connected to Redux, components are not.
`
        )
        break
      case 'ajax':
        console.log(
`
NAME
        sombrero-ajax - Create actions and action-types
USAGE
        sombrero ajax 
OPTIONS
        [--prefix] Add prefix before every url
DESCRIPTION
        Creates actions and action-types in redux inside the ajax folder, always generated automatically
        and that must not be modified.

        Requires a route-paths.json file in the constants folder of the project
`
        )
        break
      default:
        console.log(chalk.red(argv._[1],'- Command not found'))
    }
  }
}
