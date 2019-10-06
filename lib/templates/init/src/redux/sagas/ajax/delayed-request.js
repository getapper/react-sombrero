// REDUX
import {
  fork, take, takeEvery, put, delay,
} from 'redux-saga/effects'

function* delayedAjax(ajax, ajaxParams, timeout) {
  yield delay(timeout)
  yield put(ajax(...ajaxParams))
}

function* delayed(action) {
  const timeout = action.timeout || 500
  do {
    const ajaxTask = yield fork(delayedAjax, action.ajax, action.ajaxParams, timeout)
    action = yield take(action.type)
    if (ajaxTask && ajaxTask.isRunning()) {
      ajaxTask.cancel()
    }
    yield put(action.ajaxCancel())
  } while (true)
}

function* delayedRequestSaga() {
  const forks = {}
  do {
    const action = yield take(a => /^(.*?)_AJAX_DELAYED/.test(a.type))
    if (!forks[action.type]) {
      forks[action.type] = true
      yield fork(delayed, action)
    }
  } while (true)
}

export default delayedRequestSaga
