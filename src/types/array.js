const arrayProto = Array.prototype
const arrayMethods = Object.create(arrayProto)
export default arrayMethods
const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
methodsToPatch.forEach((method) => {
  const origin = arrayMethods[method]
  arrayMethods[method] = function mutation(...args) {
    const result = origin.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2)
        break;
      default:
        break;
    }
    if (inserted) ob.observeArray(inserted)
    ob.dep.reportChanged()
    return result
  }
})
