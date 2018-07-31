const callbacks = [];
let pending = false

function flushCallbacks () {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    var copy = copies[i]
    copy()
  }
}

let microTimerFunc
let macroTimerFunc
let useMacroTask = false

if (typeof Promise === 'function') {
  const p = Promise.resolve()
  microTimerFunc = () => {
    p.then(flushCallbacks)
  }
} else {
  useMacroTask = true
  macroTimerFunc = () => {
    //eslint-disable-next-line
    setTimeout(flushCallbacks,0)
  }
}

export function nextTick (cb?: Function, ctx?: Object) {
  callbacks.push(() => {
    if(cb) {
      try {
        cb.call(ctx)
      } catch(e) {
        //eslint-disable-next-line
        console.log(e)
      }
    }
  })
  if (!pending) {
    pending = true
    if(useMacroTask){
      macroTimerFunc()
    } else {
      microTimerFunc()
    }
  }
  
}