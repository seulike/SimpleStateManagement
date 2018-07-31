/* @flow */
import globalState from '../core/globalState'

export function getNextId() {
  return globalState.mobxGuid++
}

export function isObject (obj: any): boolean {
  return obj !== null && typeof obj === 'object'
}

export function hasProto (): boolean {
  return '__proto__' in {}
}
// eslint-disable-next-line
export function protoAugment(target: any, src: any, keys?: Array<string>) {
  target.__proto__ = src
}

export function copyAugment(target: any, src: any, keys: Array<string>) {
  keys.forEach((key) => {
    target[key] = src[key]
  })
}

export function def (obj: Object, key: string, val: any, enumerable?: boolean) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}

export function createInstanceofPredicate(name: string, clazz: any) {
  var propName = 'isMobX' + name
  clazz.prototype[propName] = true
  return function (v: any) {
    return isObject(v) && v[propName]
  }
}

