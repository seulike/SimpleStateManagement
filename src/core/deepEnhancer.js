import ObservableArray from '../types/observableArray'
import { asObservableObject, extendObservable, defineObservableProperty, setPropertyValue } from '../types/observableObject'
import { def } from '../utils' 

export function deepEnhancer(value) {
  if (Array.isArray(value)) {
    return new ObservableArray(value, deepEnhancer);
  } else if (Object.getPrototypeOf(value) === Object.prototype) {
    const res = {}
    asObservableObject(res, deepEnhancer)
    extendObservable(res, value)
    return res
  }
  return value
}
function runLazyInitializers(instance) {
  if (instance.__mobxDidRunLazyInitializers === true)
      return;
  if (instance.__mobxLazyInitializers) {
      def(instance, "__mobxDidRunLazyInitializers", true);
      instance.__mobxDidRunLazyInitializers &&
          instance.__mobxLazyInitializers.forEach(function (initializer) { return initializer(instance); });
  }
}
function createClassPropertyDecorator(onInitialize, get, set) {
  function classPropertyDecorator(target, key, descriptor) {
    def(target, '__mobxLazyInitializers', [])
     const value_1 = descriptor.value, initializer_1 = descriptor.initializer;
     target.__mobxLazyInitializers.push(function (instance) {
      onInitialize(instance, key,initializer_1 ? initializer_1.call(instance) : value_1 );
     });
     return {
       enumerable: true,
       configurable: true,
       get() {
        if (this.__mobxDidRunLazyInitializers !== true)
          runLazyInitializers(this);
          return get.call(this,key)
       },
       set(v) {
        set.call(this, key, v)
       }
     }
    }
    return classPropertyDecorator;
}
function createDecoratorForEnhancer(enhancer) {
  return createClassPropertyDecorator(function (target, name, baseValue) {
      //onInitialize触发函数  //222
      //函数asObservableObject生成$mobx
      var adm = asObservableObject(target, enhancer);
      defineObservableProperty(adm.$mobx, name, baseValue, enhancer);
  }, function (name) {   //下面使用到的get，
      var observable = this.$mobx.values[name];    //333
      if (observable === undefined)
          return undefined;
      return observable.get();     //ObservableValue.prototype.get;  retrun this.value即那个observalArray
/******在简单写法中直接被const counter = observable([{test:23}]);observable包起来。有类之后。this.$mobx.values[name].value才是简单情况的observable  ****/
  }, function (name, value) {    //下面使用到的set
      setPropertyValue(this, name, value);
  }, true, false);
// return createClassPropertyDecorator(A,B,C)
}
export const deepDecorator = createDecoratorForEnhancer(deepEnhancer)
