const fs = require('fs')
const path = require('path')
let index = 0
let indexNamePair = []

const addDirectoriesIndex = (tree, type) => {
  for (let i = 0; i < tree.children.length; i++) {
    if(tree.children[i].name !== 'scenes') {
      index = index + 1
      if(type === 'component') {
        tree.children[i].index = index - 1
      } else {
        tree.children[i].index = index
      }
      indexNamePair.push({index: tree.children[i].index, path: tree.children[i].path})
    }
    addDirectoriesIndex(tree.children[i], type)
  }
}

const addRouterNames = () => {
  let file
  let stringIndex
  let searchingString = 'routerStatePath=\'routing.'
  indexNamePair.map(item => {
    if(item.index !== 0) {
      file = fs.readFileSync(path.join(item.path, 'index.js'), 'ascii')
      if(file.indexOf('</HashRouter>') !== -1) {
        item.isRouter = true
        stringIndex = file.indexOf(searchingString) + searchingString.length
        item.routerName = file.slice(stringIndex, file.indexOf('Router\'')) + 'Router'
      } else {
        item.isRouter = false
        item.routerName = null
      }
    }
  })
}

module.exports = {
  addDirectoriesIndex,
  indexNamePair,
  addRouterNames
}
