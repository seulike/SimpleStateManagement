import { BaseAtom } from '../core/baseAtom'
import Reaction from '../core/reaction'
import globalState from '../core/globalState'
import Rx from 'rx';

// ispired by https://github.com/jas-chen/rx-redux/blob/master/src/createStore.js

let currentReducer = null
export default class RxRedux extends BaseAtom {
  constructor(value, reducer) {
    super();
    this.state = value;
    currentReducer = reducer
    this.atom = new BaseAtom()
    this.dispatcher$ = new Rx.Subject();
    this.reduce = this.reduce.bind(this)
    const state$ = this.dispatcher$.map(this.reduce).publish().refCount().startWith(this.state);
    // must call state$.subscribe() to start life cycle
    state$.subscribe(
      () => this.atom.reportChanged(),
      err => { throw err; }
    );
  }
  getState() {  
    return this.state
  }
  reduce(action) {
    //eslint-disable-next-line
    this.state = currentReducer(this.state, action)
    return this.state
  }
  dispatch(action) {
    this.dispatcher$.onNext(action);
    return action;
  }
  subscribe(fn: Function) {
    if (typeof fn !== 'function') throw new TypeError('param must be function')
    const reaction = new Reaction(fn);
    globalState.trackingDerivation = reaction;
    this.atom.reportObserved()
    globalState.trackingDerivation = null;
  }

}