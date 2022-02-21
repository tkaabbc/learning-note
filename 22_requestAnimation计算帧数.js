/**
 * 思路
 * requestAnimationFrame只会调用一次，所以要在cb中不断调用
 * cb回调能拿到performance.now()，从而计算出时间间隔
 */

let start = undefined
let cbTimes = 0
const cb = (time) => {
  cbTimes++
  console.log(start, time);
  if (start === undefined) {
    start = time
    return
  }
  if (time - start < 1000) {
    requestAnimationFrame(cb) // 1s内重复调用
  } else {
    if (cbTimes === null) return
    cbTimes = null
    console.log('cbTimes', cbTimes);
  }
}
requestAnimationFrame(cb)