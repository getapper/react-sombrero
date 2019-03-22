let index = 0
let indexNamePair = []

const addDirectoriesIndex = (tree) => {
  console.log('tree', tree)
  for (let i = 0; i < tree.children.length; i++) {
    if(tree.children[i].name !== 'scenes') {
      index = index + 1
      tree.children[i].index = index
      indexNamePair.push({index: tree.children[i].index, path: tree.children[i].path})
    }
    addDirectoriesIndex(tree.children[i])
  }
}

module.exports = {
  addDirectoriesIndex,
  indexNamePair
}
