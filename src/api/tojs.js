import { isObservableArray } from "../types/observableArray"
import { isObservableObject } from "../types/observableObject"
import { isObservableValue } from "../types/observableValue"


export function toJS(source) {
  // optimization: using ES6 map would be more efficient!
  // optimization: lift this function outside toJS, this makes recursion expensive
      if (isObservableArray(source)) {
          const res = []
          const toAdd = source.map(value => toJS(value));
          res.length = toAdd.length;
          for (var i = 0, l = toAdd.length; i < l; i++)
              res[i] = toAdd[i];
          return res;
      }
      if (isObservableObject(source)) {
          const res = {}
          for (var key in source)
              res[key] = toJS(source[key]);
          return res;
      }
      if (isObservableValue(source))
          return toJS(source.get());
  return source;
}