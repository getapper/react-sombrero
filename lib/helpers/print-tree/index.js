const printTree = (tree, indent, last) => {
  if(tree.index === 0) {
    console.log('scenes[0]')
  }
  if(tree.name !== 'scenes') {
    console.log(indent + '└╴ ' + tree.name + '[' + tree.index + ']')
    indent += last ? "   " : "│  "
  }
  for (let i = 0; i < tree.children.length; i++) {
    printTree(tree.children[i], indent, i === tree.children.length - 1)
  }
}

module.exports = {
  printTree
}
