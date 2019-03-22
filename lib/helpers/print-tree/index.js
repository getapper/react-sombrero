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

module.exports = {
  printTree
}
