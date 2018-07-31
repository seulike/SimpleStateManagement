import { BaseAtom } from '../core/baseAtom'
import { deepEnhancer }  from '../core/deepEnhancer'
import { UNCHANGED } from '../constant'
import { createInstanceofPredicate } from '../utils'

export default class ObservableValue extends BaseAtom {
  constructor(value) {
    super();
    this.value = deepEnhancer(value);
  }
  get() {
    this.reportObserved();
    return this.value;
  }
  set(v) {
    this.value = deepEnhancer(v);
    this.reportChanged();
  }
  prepareNewValue(newValue) {
    // apply modifier
    newValue = deepEnhancer(newValue)
    return this.value !== newValue ? newValue : UNCHANGED
  }
  setNewValue(newValue) {
    this.value = newValue
    this.reportChanged()
  }

}
export const isObservableValue = createInstanceofPredicate("ObservableValue", ObservableValue);