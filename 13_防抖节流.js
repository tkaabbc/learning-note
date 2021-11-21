// 防抖 记录定时器 在时间间隔内触发就清空定时器重新计时。用于用户搜索自动联想
// 注意：可以视实际使用情况绑定this方便操作
function debounce (func, delay) {
  let timer

  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      // console.log(this);
      func.apply(this, args) // 如果有需要可以让this指向外层函数的this，否则指向window
    }, delay)
  }
}


// 节流 记录上次调用时间 大于等于时间间隔之后才调用一次。用于防止按钮误点两次
// 注意：这里可以支持传that
function throttle (func, delay, that) {
  let time = +new Date()

  return function (...args) {
    let nowTime = +new Date()

    if (nowTime - time < delay) {
      return
    }
    time = nowTime
    func.apply(that, args)
  }
}
