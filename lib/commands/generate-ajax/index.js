const chalk = require('chalk')
const _ = require('lodash')
const path = require('path')
const fs = require('fs')

const getPrefixFromMethod = method => ({
  get: 'get',
  post: 'create',
  delete: 'delete',
  put: 'update',
}[method])

const create = (action, actionTypes, actions, r, apiPrefix, routePath, apiDelimiter) => {
  action = action.replace('.', '_')
  const type = `${action}AJAX_REQUEST`
  const request = `export const ${action}AJAX_REQUEST = '${action}AJAX_REQUEST'\n`
  const success = `export const ${action}AJAX_SUCCESS = '${action}AJAX_SUCCESS'\n`
  const failed = `export const ${action}AJAX_FAILED = '${action}AJAX_FAILED'\n`
  const canceled = `export const ${action}AJAX_CANCEL = '${action}AJAX_CANCEL'\n`
  const dealyed = `export const ${action}AJAX_DELAYED = '${action}AJAX_DELAYED'\n\n`
  const arr = r.split(apiDelimiter)
  const method = arr.pop().toLowerCase()
  const names = []
  let index = 0
  names[0] = ''
  const params = []
  for (const a in arr) {
    let next = false
    console.log(arr[a])
    if (arr[a][0] === '$') {
      params.push(arr[a].slice(1))
      arr[a] = `by-${arr[a].slice(1)}`
      next = true
    }
    names[index] += arr[a]
      .split('-')
      .map(s => s.charAt(0).toUpperCase() + s.slice(1))
      .join('')
      .split('.')
      .map(s => s.charAt(0).toUpperCase() + s.slice(1))
      .join('')
    if (next && a < arr.length - 1) {
      names[index] = `From${names[index]}`
      index++
      names[index] = ''
    }
  }

  const functionName = `${getPrefixFromMethod(method) + names.reverse().join('')}Ajax`
  const paramsList = params.length ? `, ${params.join(', ')}` : ''
  const url = routePath.replace(/{/g, '${')
  const noParams = url === routePath
  const s = `export const ${functionName} = (restUri${paramsList}${method !== 'get' && method !== 'delete' ? ', payload' : ''}, others) => ({
  type: ajaxTypes.${type},   
  method: '${method.toUpperCase()}',
  url: \`\${restUri}${apiPrefix}${url}\`${method !== 'get' && method !== 'delete' ? `,
  data: payload` : ''},
  ...others
})
    
`
  let sDelayed = ''
  if (method === 'get') {
    sDelayed = `export const ${functionName}Cancel = () => ({
  type: ajaxTypes.${`${action}AJAX_CANCEL`},
})
    
export const ${functionName}Delayed = (restUri${paramsList}, others, timeout) => ({
  type: ajaxTypes.${`${action}AJAX_DELAYED`},
  ajax: ${functionName},
  ajaxCancel: ${functionName}Cancel,
  ajaxParams: [
    restUri${paramsList}, others,
  ],
  timeout,
})

`
  }
  return [actionTypes.concat(request).concat(success).concat(failed).concat(canceled)
    .concat(dealyed), actions.concat(s).concat(sDelayed)]
}

const write = (actions, actionTypes) => {
  const dirname = process.cwd()
  if (!fs.existsSync(path.join(dirname, 'src/redux/action-types/ajax'))) {
    fs.mkdirSync(path.join(dirname, 'src/redux/action-types/ajax'))
  }
  if (!fs.existsSync(path.join(dirname, 'src/redux/actions/ajax'))) {
    fs.mkdirSync(path.join(dirname, 'src/redux/actions/ajax'))
  }
  fs.writeFileSync(path.join(dirname, 'src/redux/actions/ajax/index.js'), actions)
  fs.writeFileSync(path.join(dirname, 'src/redux/action-types/ajax/index.js'), actionTypes)
}

module.exports = argv => {
  const apiPrefix = argv.prefix || ''
  const apiDelimiter = argv.delimiter || '/'
  const dirname = process.cwd()
  let actionTypes = ''
  let actions = ''
  let routePaths
  try {
    routePaths = require(path.join(dirname, 'constants', 'route-paths.json'))
  } catch (err) {
    console.log(chalk.red('Ajax generation requires a valid route-paths.json file in constants directory'))
    process.exit(1)
  }
  for (const r in routePaths) {
    const arr = r.split(apiDelimiter)
    const method = arr.pop().toLowerCase()
    const names = []
    const actionNames = []
    let index = 0
    names[0] = ''
    actionNames[0] = ''
    for (const a in arr) {
      let next = false
      if (arr[a][0] === '$') {
        arr[a] = `by-${arr[a].slice(1)}`
        next = true
      }
      names[index] += arr[a]
        .split('-')
        .map(s => s.charAt(0).toUpperCase() + s.slice(1))
        .join('')
      actionNames[index] += `${arr[a]
        .split('-')
        .map(s => s.toUpperCase())
        .join('_')}_`
      if (next && a < arr.length - 1) {
        names[index] = `From${names[index]}`
        actionNames[index] = `FROM_${actionNames[index]}`
        index++
        names[index] = ''
        actionNames[index] = ''
      }
    }
    [actionTypes, actions] = create(`${getPrefixFromMethod(method).toUpperCase()}_${actionNames.reverse().join('')}`, actionTypes, actions, r, apiPrefix, routePaths[r], apiDelimiter)
  }
  actions = `import * as ajaxTypes from 'root-redux/action-types/ajax'\n\n${actions}`
  write(actions, actionTypes)
  console.log(chalk.green('DONE! Action-types and actions created'))
  process.exit(0)
}
