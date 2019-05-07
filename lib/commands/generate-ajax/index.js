const chalk = require('chalk')
const _ = require('lodash')
const path = require('path')
const fs = require('fs')

const getPrefixFromMethod = method => {
  return {
    'get': 'get',
    'post': 'create',
    'delete': 'delete',
    'put': 'update',
  }[method]
}

const create = (action, actionTypes, actions, r, apiPrefix, routePath) => {
  const type = action + 'AJAX_REQUEST'
  const request = `export const ${action}AJAX_REQUEST = '${action}AJAX_REQUEST'\n`
  const success = `export const ${action}AJAX_SUCCESS = '${action}AJAX_SUCCESS'\n`
  const failed = `export const ${action}AJAX_FAILED = '${action}AJAX_FAILED'\n\n`
  const arr = r.split('@')
  const method = arr.pop().toLowerCase()
  let names = []
  let index = 0
  names[0] = ''
  let params = []
  for (let a in arr) {
    let next = false
    if (arr[a][0] === '$') {
      params.push(arr[a].slice(1))
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

  const functionName = getPrefixFromMethod(method) + names.reverse().join('') + 'Ajax'
  const paramsList = params.length ? `, ${params.join(', ')}` : ''
  const url = routePath.replace(/{/g, '${')
  const s =
  `export const ${functionName} = (server${paramsList}${method !== 'get' && method !== 'delete' ? ', payload' : ''}) => ({
  type: '${type}',   
  method: '${method.toUpperCase()}',
  url: \`${apiPrefix}${url}\`${method !== 'get' && method !== 'delete' ? `,
  payload` : ''}
})
    
`
  return [actionTypes.concat(request).concat(success).concat(failed), actions.concat(s)]
}

const write = (actions, actionTypes) => {
  let dirname = process.cwd()
  if(!fs.existsSync(path.join(dirname, 'redux/action-types/ajax'))) {
    fs.mkdirSync(path.join(dirname, 'redux/action-types/ajax'))
  }
  if(!fs.existsSync(path.join(dirname, 'redux/actions/ajax'))) {
    fs.mkdirSync(path.join(dirname, 'redux/actions/ajax'))
  }
  fs.writeFileSync(path.join(dirname, 'redux/actions/ajax/index.js'), actions)
  fs.writeFileSync(path.join(dirname, 'redux/action-types/ajax/index.js'), actionTypes)
}

module.exports = argv => {
  let apiPrefix = argv.prefix || ''
  let dirname = process.cwd()
  let actionTypes = ''
  let actions = ''
  const routePaths = require(path.join(dirname, 'constants', 'route-paths.json'))
  for (let r in routePaths) {
    const arr = r.split('@')
    const method = arr.pop().toLowerCase()
    let names = []
    let actionNames = []
    let index = 0
    names[0] = ''
    actionNames[0] = ''
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
      actionNames[index] += arr[a]
        .split('-')
        .map(s => s.toUpperCase())
        .join('_') + '_'
      if (next && a < arr.length - 1) {
        names[index] = 'From' + names[index]
        actionNames[index] = 'FROM_' + actionNames[index]
        index++
        names[index] = ''
        actionNames[index] = ''
      }
    }
    [actionTypes, actions] = create(getPrefixFromMethod(method).toUpperCase() + '_' + actionNames.reverse().join(''), actionTypes, actions, r, apiPrefix, routePaths[r])
  }
  write(actions, actionTypes)
}
