import { BaseAtom } from "../core/baseAtom";
import ObservableValue from './observableValue'
import { UNCHANGED } from '../constant'
import { isObject, def, createInstanceofPredicate } from '../utils'

class ObservableObjectAdministration {
  values: Object;
  enhancer: Function;
  target: any;
  atom: BaseAtom;

  constructor(value, enhancer) {
    this.values = {};
    this.enhancer = enhancer;
    this.target = value;
    this.atom = new BaseAtom();
  }
}

export function asObservableObject(res: Object, deepEnhancer: Function) {
  def(res, '$mobx', new ObservableObjectAdministration(res, deepEnhancer))
  return res
}

function generateObservablePropConfig(propName: string) {
  return {
    configurable: true,
    enumerable: true,
    get() {
      return this.$mobx.values[propName].get();
    },
    set(v) {
      this.$mobx.values[propName].set(v);
    }
  };
}
export function setPropertyValue(instance, name: string, newValue) {
  const adm = instance.$mobx
  const observable = adm.values[name]
  newValue = observable.prepareNewValue(newValue)
  if (newValue !== UNCHANGED) {
    observable.setNewValue(newValue)
  }
}
export function defineObservableProperty(admin, key, value) {
  admin.values[key] = new ObservableValue(value);
  Object.defineProperty(admin.target, key, generateObservablePropConfig(key));
}
export function extendObservable(res, value) {
  const keys = Object.keys(value);
  const admin = res.$mobx;
  keys.forEach(key => defineObservableProperty(admin, key, value[key]));
}

const isObservableObjectAdministration = createInstanceofPredicate('ObservableObjectAdministration', ObservableObjectAdministration)
export function isObservableObject(thing) {
  return isObject(thing) && isObservableObjectAdministration(thing.$mobx);
}