const fs = require('fs')
const dirTree = require('directory-tree')
const path = require('path')

module.exports = async argv => {
  let sceneName = argv._[2]
  let dirname = process.cwd()
  let scenes = {}
  let tree = dirTree(path.join(dirname, 'scenes'), { extensions: /\.(js|jsx)$/ })

  printTree(tree, "", true)

}

const printTree = (tree, indent, last) => {
  if(tree.name !== 'scenes') {
    console.log(indent + '└╴ ' + tree.name)
  }
  indent += last ? "   " : "│  "
  for (let i = 0; i < tree.children.length; i++)
  {
    if(tree.children[i].type === 'directory') {
      printTree(tree.children[i], indent, i === tree.children.length - 1)
    }
  }
}

