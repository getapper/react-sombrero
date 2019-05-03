const chalk = require('chalk')

const printTree = (tree, indent, last, type) => {
  if(tree.index === 0) {
    if(type === 'scene') {
      console.log('scenes[0]')
    } else {
      console.log('scenes')
    }
  }
  if(tree.name !== 'scenes') {
    console.log(indent + '└╴ ' + tree.name + '[' + tree.index + ']')
    indent += last ? "   " : "│  "
  }
  for (let i = 0; i < tree.children.length; i++) {
    printTree(tree.children[i], indent, i === tree.children.length - 1, type)
  }
}

const printTreeWithRouter = (tree, indent, last, type, indexNamePair) => {
  if(tree.index === 0) {
    if(type === 'scene') {
      console.log('scenes['+ chalk.bold('0') +'] (mainRouter)')
    } else {
      console.log('scenes')
    }
  }
  if(tree.name !== 'scenes') {
    console.log(indent + '└╴ ' + tree.name + (indexNamePair[tree.index].isRouter && '[' + chalk.bold(tree.index) + ']') + (indexNamePair[tree.index].isRouter ? ` (${indexNamePair[tree.index].routerName})` : ''))
    indent += last ? "   " : "│  "
  }
  for (let i = 0; i < tree.children.length; i++) {
    printTreeWithRouter(tree.children[i], indent, i === tree.children.length - 1, type, indexNamePair)
  }
}

module.exports = {
  printTree,
  printTreeWithRouter
}
