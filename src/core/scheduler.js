import { nextTick } from './nextTick'
import { Reaction } from './reaction'
const queue: Array<Reaction> = []
let has = {}
function flushSchedulerQueue(){
  const copies = queue.slice(0)
  queue.length = 0
  for (let i = 0; i < copies.length; i++) {
    var copy = copies[i]
    copy.onvalidate()
  }
}
export function queueWatcher(watcher: Reaction) {
  if(has[watcher.name]) return
  queue.push(watcher)
  has[watcher.name] = true
  nextTick(flushSchedulerQueue)
}