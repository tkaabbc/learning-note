// bind要实现的功能点
// 1）bind可以绑定this指向
// 2）bind返回一个绑定后的函数（高阶函数）
// 附加题(选择性做)
// 3）如果绑定的函数被new了，当前函数的this就是当前的实例
// 4）new出来的结果可以找到原有类的原型

// 总结：
// 12看着测试用例 明确用法 倒推回去实现就好了
// 34涉及原型链以后有空了实现

Function.prototype.myBind = function (context, ...args) {
  return (...args2) => {
    return this.call(context, ...args, ...args2)
  }
}

// 测试用例
const aa = {
  name : 'tk'
}
function say(something,other){
  console.log(`I want to tell ${this.name} ${something}`);
  console.log('This is some'+other)
}

const bindSay = say.myBind(aa, 1)
bindSay(2)

// call/apply
// 1) 第一个参数改变this指向，传null/undefined 指向 window
// 2) 传参

// 总结：核心是context.fn = this 利用this谁调用指向谁的这个特性，让context变成调用一个挂载原函数的对象
//      这样原函数一调用就指向context
//      然后call和apply只有接受参数不同，其它实现一样
Function.prototype.mycall = function (context, ...args) {
  context = context || window
  context.fn = this
  const result = context.fn(...args)
  delete context.fn
  return result
}

Function.prototype.myapply = function (context, args) {
  context = context || window
  context.fn = this
  const result = context.fn(...args)
  delete context.fn
  return result
}

//测试用例
let cc = {
  a: 1
}

function demo(x1, x2) {
  console.log(typeof this, this.a, this)
  console.log(x1, x2)
}
demo.apply(cc, [2, 3])
demo.myapply(cc, [2, 3])
demo.call(cc,33,44)
demo.mycall(cc,33,44)
