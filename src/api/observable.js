import ObservableValue from '../types/observableValue'
import observe from '../types/observableVue'
import { deepEnhancer, deepDecorator } from '../core/deepEnhancer'
import ReduxStore from '../types/reduxStore'
import { observeProxy } from '../types/observableProxy'
import RxRedux from '../types/RxRedux'

function observable(value) {
  if (typeof arguments[1] === 'string')
    return deepDecorator.apply(null, arguments)
  const res = deepEnhancer(value);
  if (res !== value) return res;
  return new ObservableValue(value);
}
observable.vue = function vue(value) {
  observe(value)
  return value
}
observable.proxy = function proxy(value) {
  return observeProxy(value)
}
observable.createStore = function createStore(value, reducer) {
  return new ReduxStore(value, reducer)
}
observable.rxRedux = function createStore(value, reducer) {
  return new RxRedux(value, reducer)
}
export default observable
