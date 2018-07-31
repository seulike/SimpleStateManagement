/* @flow */
import { getNextId } from '../utils'
import { queueWatcher } from './scheduler'
export default class Reaction {
  name: string;
  onvalidate: Function;
  
  constructor(fn: Function) {
    if(typeof fn !== 'function') throw new TypeError('param must be function')
    const name = "Autorun@" + getNextId();
    this.name = name;
    this.onvalidate = fn;
  }
  update() {
    queueWatcher(this)
  }
}