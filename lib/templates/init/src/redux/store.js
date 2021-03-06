// REDUX
import { createStore, applyMiddleware, compose } from 'redux'
import { combineReducers } from 'redux-immutable'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './sagas'
import reducers from './reducers'
import initialState from './initial-states'

const composeEnhancers = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose : compose // eslint-disable-line
const sagaMiddleware = createSagaMiddleware()

const store = createStore(
  combineReducers(reducers),
  initialState,
  composeEnhancers(applyMiddleware(sagaMiddleware))
)
sagaMiddleware.run(rootSaga)

export default store
