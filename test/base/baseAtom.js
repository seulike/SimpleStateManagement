var m = require("../../")

test("baseAtom work well", function() {
  const baseAtom = new m.BaseAtom()
  const globalState = m.globalState
  var value = 0
  globalState.trackingDerivation = { name: 'test', onvalidate: () => value = 23}
  baseAtom.reportObserved()
  baseAtom.reportChanged()
  expect(value).toEqual(23)
})

test("baseAtom doesn't register duplicate trackingDerivation", function() {
  const baseAtom = new m.BaseAtom()
  const globalState = m.globalState
  const value = []
  globalState.trackingDerivation = { name: 'test', onvalidate: () => value.push(23)}
  baseAtom.reportObserved()
  baseAtom.reportChanged()
  expect(value).toEqual([23])
})