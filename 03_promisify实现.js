// 实现node util.promisify
// 传入一个遵循常见的错误优先的回调风格的函数（即以一个 (err, value) => ... 回调作为最后一个参数），并且返回一个返回 promise 的版本。
// http://nodejs.cn/api/util.html#util_util_promisify_original
// const newFn = promisify(fn)
// newFn(a).then()

// 总结：
// 先设计：明确最后要怎么使用这个方法
// 再倒推 如果不需要立即调用就返回一个函数return function
// 参数的透传
// 知道约定好了回调是最后一个参数
// 其它也没什么问题了

function promisify(fn) {
  
  return function (...params) {
    
    return new Promise((resolve, reject) => {
      fn(...params, function (err, data) {
        err ? reject() : resolve(data)
      })
    })
  }
}

// test
const fs = require('fs')
const newFs = promisify(fs.readFile)
newFs('./README.md', 'utf-8').then(data => console.log(data), err => console.log(err))
