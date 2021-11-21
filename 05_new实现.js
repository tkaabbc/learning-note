/**
 * 
  new 关键字会进行如下的操作：
  1 创建一个空的简单JavaScript对象（即{}）；
  2 将空对象的__proto__连接到(赋值为)该函数的prototype
  3 将步骤1新创建的对象作为this的上下文 ；
  4 如果构造函数没有返回对象，则返回this（this即1中创建的对象）。
 * 
 * */

// 总结
// 知道new的功能后，按着上面的四步实现就好了，难点就是要知道prototype和constroctor干嘛的

function myNew(Fn, ...rest) {
  // 请在此处完善代码，不能直接使用 new 操作符

  // 1 2
  const obj = Object.create(Fn.prototype)
  // 3
  const constructorRes = Fn.apply(obj, rest)
  // 4
  return constructorRes instanceof Object ? constructorRes : obj
}

function Fun(name,sex) {
  this.name = name
  this.sex = sex
}

Fun.prototype.getUserInfo = function() {
  return `我的姓名${this.name},我的性别${this.sex}`
}
 
const fun = myNew(Fun,'tk','男')
// 我的姓名tk，我的性别男
console.log(fun)
console.log(fun.getUserInfo())
