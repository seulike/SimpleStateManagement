/* @flow */
import Reaction from '../core/reaction'
import globalState from '../core/globalState'

export function autorun(fn: Function) {
  if (typeof fn !== 'function') throw new TypeError('param must be function')
  const reaction = new Reaction(fn);
  globalState.trackingDerivation = reaction;
  reaction.onvalidate();
  globalState.trackingDerivation = null;
}
