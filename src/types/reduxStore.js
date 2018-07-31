import { BaseAtom } from '../core/baseAtom'
import Reaction from '../core/reaction'
import globalState from '../core/globalState'

export default class ReduxStore extends BaseAtom {
  constructor(value, reducer) {
    super();
    this.state = value;
    this.reducer = reducer
    this.atom = new BaseAtom()
  }
  getState() {
    return this.state
  }
  dispatch(action) {
    this.state = this.reducer(this.state, action)
    this.atom.reportChanged()
  }
  subscribe(fn: Function) {
    if (typeof fn !== 'function') throw new TypeError('param must be function')
    const reaction = new Reaction(fn);
    globalState.trackingDerivation = reaction;
    this.atom.reportObserved()
    globalState.trackingDerivation = null;
  }

}