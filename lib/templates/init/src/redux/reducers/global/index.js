// LIBS
import immutable from 'immutable' //eslint-disable-line
import _ from 'lodash'

// REDUX
import initialState from 'root-redux/initial-states/global'
import {
  UPDATE_AJAX_LOADING,
  SHOW_FEEDBACK,
  CLOSE_FEEDBACK,
} from 'root-redux/action-types'

const reducer = {}

reducer[UPDATE_AJAX_LOADING] = (state, action) => {
  const { api, isLoading, uid } = action
  state = state.setIn(['ajaxLoaders', `${api}_${uid}`], isLoading)
  return state
}

reducer[SHOW_FEEDBACK] = (state, action) => {
  const feedback = _.get(action, 'feedback', null)
  if (feedback) {
    state = state.setIn(['feedback', 'isOpen'], true)
    state = state.setIn(['feedback', 'message'], feedback.message)
    state = state.setIn(['feedback', 'type'], feedback.type)
  }
  return state
}

reducer[CLOSE_FEEDBACK] = state => state.setIn(['feedback', 'isOpen'], false)

export default (state = initialState, action) => {
  if (typeof reducer[action.type] !== 'undefined') {
    return reducer[action.type](state, action)
  }
  return state
}
