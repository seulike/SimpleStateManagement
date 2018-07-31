const m = require("../../")

test("autorun passes Reaction as an argument to view function", function() {
  const observable = m.observable
  const autorun = m.autorun
  const test = observable(34);
  const values = []
  autorun(() => {
    values.push(test)
  });
  test.set(56);
  const p = Promise.resolve()
  p.then(() => {
    expect(values).toEqual([34,56])
  })
})

test("autorun use vue-like observable", function() {
  const observable = m.observable
  const autorun = m.autorun
  const test = {data:{num:34}}
  const values = []
  observable.vue(test)
  autorun(() => {
    values.push(test.data.num)
  });
  test.data.num = 56
  const p = Promise.resolve()
  p.then(() => {
    expect(values).toEqual([34,56])
  })
})

test("autorun use proxy observable", function() {
  const observable = m.observable
  const autorun = m.autorun
  var test = { data: { num: 34 } };
  test = observable.proxy(test);
  var values = []
  autorun(function () {
    values.push(test.data.num);
  });
  test.data.num = 56;
  const p = Promise.resolve()
  p.then(() => {
    expect(values).toEqual([34,56])
  })
})

test("autorun use vue-like observable", function() {
  class store {
    @observable counter = [{data :34}]    //初始化为数组
  }
  const cls = new store()
  const values = []
  autorun(() => {
    console.log('autorun', values.push(cls.counter[0].data));
  });
  cls.counter[0].data = 56;   // set改变数组
  const p = Promise.resolve()
  p.then(() => {
    expect(values).toEqual([34,56])
  })
})

test("autorun use redux", function() {
  const observable = m.observable
  var reducer = function(state, action){
    switch (action.type) {
      case 'inc' :
        return { ...state, counter : state.counter + 1}
      case 'dec' :
        return { ...state, counter : state.counter - 1}
      default :
      return state
    }
  }
  const values = []
  var store = observable.createStore({counter: 0}, reducer)
  var render = () => values.push(store.getState().counter)
  render()
  store.subscribe(render)
  store.dispatch({type: 'inc'})
  const p = Promise.resolve()
  p.then(() => {
    expect(values).toEqual([0,1])
  })
})

test("autorun use rxRedux", function() {
  const observable = m.observable
  var reducer = function(state, action){
    switch (action.type) {
      case 'inc' :
        return { ...state, counter : state.counter + 1}
      case 'dec' :
        return { ...state, counter : state.counter - 1}
      default :
      return state
    }
  }
  const values = []
  var store = observable.rxRedux({counter: 0}, reducer)
  var render = () => values.push(store.getState().counter)
  render()
  store.subscribe(render)
  store.dispatch({type: 'inc'})
  const p = Promise.resolve()
  p.then(() => {
    expect(values).toEqual([0,1])
  })
})