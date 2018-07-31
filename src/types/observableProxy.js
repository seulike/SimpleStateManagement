import { BaseAtom } from '../core/baseAtom'
import globalState from '../core/globalState'
import { isObject } from '../utils'
export function observeProxy(obj) {
  if(globalState.proxies.has(obj)) {
    return 
  }
  return getProxyValue(obj)
}
function getProxyValue(obj){
  // const resultIsObject = isObject(obj)
  if(globalState.proxies.has(obj)) {
    return globalState.proxies.get(obj)
  }
  const result = setProxy(obj)
  globalState.proxies.set(obj, result)
  return result
}
export function setProxy(obj) {
  const base = new BaseAtom()
  const overload = new Proxy(obj,{
    get: function(target, key, receiver){
      var value =  Reflect.get(target , key , receiver);
      base.reportObserved()
      if(isObject(value)) {
        value = getProxyValue(value)
      }
      return value
    },  
    set: function(target, key, value, receiver){
      const result = Reflect.set(target, key, value, receiver)
      base.reportChanged()
      return result
    }
  })
  return overload
}