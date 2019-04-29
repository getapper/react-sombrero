const chalk = require('chalk')
const _ = require('lodash')
const path = require('path')

const getPrefixFromMethod = method => {
  return {
    'get': 'get',
    'post': 'create',
    'delete': 'delete',
    'put': 'update',
  }[method]
}

module.exports = argv => {
  let dirname = process.cwd()
  const routePaths = require(path.join(dirname, 'constants', 'route-paths.json'))
  for (let r in routePaths) {
    const arr = r.split('@')
    const method = arr.pop().toLowerCase()
    let names = []
    let index = 0
    names[0] = ''
    for (let a in arr) {
      let next = false
      if (arr[a][0] === '$') {
        arr[a] = 'by-' + arr[a].slice(1)
        next = true
      }
      names[index] += arr[a]
        .split('-')
        .map(s => s.charAt(0).toUpperCase() + s.slice(1))
        .join('')
      if (next && a < arr.length - 1) {
        names[index] = 'From' + names[index]
        index++
        names[index] = ''
      }
    }
    console.log(getPrefixFromMethod(method) + names.reverse().join('') + 'Ajax')
  }
}
