import globalState from '../core/globalState'
class BaseAtom {
  constructor() {
    this.observers = [];
  }
  reportObserved() {
    const derivation = globalState.trackingDerivation
    if (derivation && this.observers.indexOf(derivation) === -1) {
      this.observers.push(derivation);
    }
  }
  reportChanged() {
    this.observers.forEach(item => typeof item.onvalidate === 'function' && item.update());
  }
}
export {
  BaseAtom,
}
