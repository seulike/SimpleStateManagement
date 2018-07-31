/* @flow */
import { BaseAtom } from '../core/baseAtom';
import { isObject, createInstanceofPredicate, def} from '../utils'

class ObservableArrayAdministration {
  values: any;
  enhancer: any;
  atom: BaseAtom;

  constructor(value: any, enhancer: Function) {
    this.values = [];
    this.enhancer = enhancer;
    this.atom = new BaseAtom();
  }
  spliceWithArray(index, deleteCount, newItems) {
    newItems = newItems.map(item => this.enhancer(item));
    this.values.splice.apply(
      this.values,
      [index, deleteCount].concat(newItems)
    );
  }
}
function createArrayEntryDescriptor(index :number): Object {
  return {
    enumerable: true,
    configurable: true,
    get() {
      return this.get(index);
    },
    set(value) {
      return this.set(index, value);
    }
  };
}
export default class ObservableArray {
  $mobx: ObservableArrayAdministration;

  constructor(value: any, deepEnhancer: Function) {
    def(this, '$mobx', new ObservableArrayAdministration(value, deepEnhancer))
    if (value && value.length) {
      this.spliceWithArray(0, 0, value);
    }
  }
  spliceWithArray(index: number, deleteCount: number, newItems: any) {
    return this.$mobx.spliceWithArray(index, deleteCount, newItems);
  }
  get(index: number) {
    let impl = this.$mobx;
    if (impl) {
      this.$mobx.atom.reportObserved();
      return this.$mobx.values[index];
    }
  }
  set(index: number, value: any) {
    let impl = this.$mobx;
    if (impl) {
      this.$mobx.spliceWithArray(index, 1, [value]);
      this.$mobx.atom.reportChanged();
    }
  }
  peek() {
    this.$mobx.atom.reportObserved()
    return this.$mobx.values
  }
  length() {
    return this.$mobx.values.length
  }
}
function createArrayBuffer(num: number) {
  new Array(num).fill(0).forEach((item, index) => {
    Object.defineProperty(
      ObservableArray.prototype,
      '' + index,
      createArrayEntryDescriptor(index)
    );
  });
}
createArrayBuffer(100);
[
  "every",
  "filter",
  "forEach",
  "indexOf",
  "join",
  "lastIndexOf",
  "map",
  "reduce",
  "reduceRight",
  "slice",
  "some",
  "toString",
  "toLocaleString"
].forEach(function(method) {
  const baseFunc = Array.prototype[method]
  def(ObservableArray.prototype, method, function(){
    return baseFunc.apply(this.peek(), arguments)
  })
  return method
})

const isObservableArrayAdministration = createInstanceofPredicate('ObservableArrayAdministration', ObservableArrayAdministration)
export function isObservableArray(thing: any) {
  return isObject(thing) && isObservableArrayAdministration(thing.$mobx);
}
