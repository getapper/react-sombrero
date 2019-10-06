// LIBS
import immutable from 'immutable'

// REDUX
import initialState from 'root-redux/initial-states/routing'
import {
  HASH_ROUTING_INIT_ROUTING,
  HASH_ROUTING_UPDATE_ACCESS_TO_ROUTE,
  HASH_ROUTING_SWITCH_ROUTE,
  HASH_ROUTING_SET_NEXT_ROUTE
} from 'react-redux-hash-router'

const reducer = {}

reducer[HASH_ROUTING_INIT_ROUTING] = (state, action) => {
  const routerName = action.routerStatePath.split('.').pop()
  const newRouter = action.router.merge(state.get(routerName))
  state = state.set(routerName, newRouter)
  return state
}

reducer[HASH_ROUTING_SET_NEXT_ROUTE] = (state, action) => state.setIn(
  [action.routerStatePath.split('.').pop(), 'next'],
  action.routeKey
)

reducer[HASH_ROUTING_SWITCH_ROUTE] = (state, action) => {
  state = state.setIn(
    [action.routerStatePath.split('.').pop(), 'active'],
    action.routeKey
  )
  state = state.setIn(
    [action.routerStatePath.split('.').pop(), 'params'],
    immutable.fromJS(action.params)
  )
  return state
}

reducer[HASH_ROUTING_UPDATE_ACCESS_TO_ROUTE] = (state, action) => state.setIn(
  [action.routerStateName, 'routes', action.routeKey, 'accessible'],
  action.access
)

export default (state = initialState, action) => {
  if (typeof reducer[action.type] !== 'undefined') {
    return reducer[action.type](state, action)
  }
  return state
}
