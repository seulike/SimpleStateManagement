//import { observable, autorun } from './lib'
var observable = require('./lib').observable
var autorun = require("./lib").autorun
var toJS = require('./lib').toJS
// test[0].data
// autorun(() => {
//   console.log(test[0].data)
// })
//var test = observable(45);
/** use like vue  **/
var test = {data:[{num:23}]}
observable.vue(test)
autorun(() => {
  test.data
  console.log(test.data[0].num)
});
test.data.splice(0,1,{num : 66666})
/** use like redux  **/
// var reducer = function(state, action){
//   switch (action.type) {
//     case 'inc' :
//       return { ...state, counter : state.counter + 1}
//     case 'dec' :
//       return { ...state, counter : state.counter - 1}
//     default :
//     return state
//   }
// }
// var store = observable.createStore({counter: 0}, reducer)
// var render = () => console.log(store.getState().counter)
// render()
// store.subscribe(render)
// store.dispatch({type: 'inc'})
/** use proxy  **/
  // var test = {data:{num:34}}
  // test = observable.proxy(test)
  // autorun(() => {
  //   console.log(test.data.num)
  // });
  // test.data.num = 57