/* @flow */
import { BaseAtom } from '../core/baseAtom'
import { isObject, hasProto, copyAugment, protoAugment, def } from '../utils'
import arrayMethods from './array'
import globalState from '../core/globalState'
const arrayKeys = Object.getOwnPropertyNames(arrayMethods)

function defineReactive(obj: any, key: string, value: any) {
  let childOb = observe(value)
  const dep = new BaseAtom()
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: true,
    get() {
      if (globalState.trackingDerivation) {
        dep.reportObserved()
        if (childOb) childOb.dep.reportObserved()
      }
      return value
    },
    set(newVal) {
      if (newVal === value) return
      value = newVal
      // observe new data
      childOb = observe(newVal)
      // report change to update
      dep.reportChanged()
    }
  })
}
/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
export default function observe (value: any): Observer | void {
  if (!isObject(value)) {
    return
  }
  if (!value.__ob__) {
    return new Observer(value)
  }
}

class Observer {
  __ob__: Observer;
  dep: BaseAtom;

  constructor(value: any) {
    def(value, '__ob__', this)
    this.dep = new BaseAtom()
    if (Array.isArray(value)) {
      const augment = hasProto() ? protoAugment : copyAugment
      augment(value, arrayMethods, arrayKeys)
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }
  observeArray = (value) => {
    value.forEach(item => observe(item))
  }
  walk = (value: any) => {
    const keys = Object.keys(value)
    keys.forEach(key => defineReactive(value, key, value[key]))
  }
}
