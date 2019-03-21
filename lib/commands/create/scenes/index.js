const fs = require('fs')
const dirTree = require('directory-tree')
const path = require('path')
const _ = require('lodash')
const inquirer = require('inquirer')
const Directories = require('../../../models/directories')

let index = 0
let indexNamePair = []

module.exports = async () => {
  const directories = new Directories()
  let dirname = process.cwd()
  let tree = dirTree(path.join(dirname, 'scenes'), {extensions: /\.(js|jsx)$/, exclude: /components/})
  let directoryNumber = 0
  let sceneName = ''

  addDirectoriesIndex(tree, index)

  printTree(tree, "", true)

  await inquirer
    .prompt([
      {
        type: 'input',
        name: 'number',
        message: 'Insert number'
      },
      {
        type: 'input',
        name: 'name',
        message: 'Insert name'
      }
    ])
    .then(answers => {
      directoryNumber = answers.number
      sceneName = answers.name
    })

  directories.create(path.join(indexNamePair[directoryNumber].path, sceneName))


}

const addDirectoriesIndex = (tree) => {
  if (tree.name === 'scenes') {
    tree.index = 0
    indexNamePair.push({index: tree.index, path: tree.path})
  }
  for (let i = 0; i < tree.children.length; i++) {
    index = index + 1
    tree.children[i].index = index
    indexNamePair.push({index: tree.children[i].index, path: tree.children[i].path})
    addDirectoriesIndex(tree.children[i])
  }
}

const printTree = (tree, indent, last) => {
  console.log(indent + '└╴ ' + tree.name + '[' + tree.index + ']')
  indent += last ? "   " : "│  "
  for (let i = 0; i < tree.children.length; i++) {
    printTree(tree.children[i], indent, i === tree.children.length - 1)
  }
}

