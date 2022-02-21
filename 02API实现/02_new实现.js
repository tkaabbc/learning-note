/**
 * 
  new 关键字会进行如下的操作：
  1.创建一个空的简单JavaScript对象（即{}）；
  2.为步骤1新创建的对象添加属性__proto__，将该属性链接至构造函数的原型对象 ；
  3.将步骤1新创建的对象作为this的上下文；
  4.如果该函数没有返回对象，则返回this。
 * 
 * */
function myNew(constructor, ...rest) {
  // 请在此处完善代码，不能直接使用 new 操作符
 }
function Fun(name,sex) {
  this.name = name
  this.sex = sex
}
Fun.prototype.getUserInfo = function() {
  return `我的姓名${this.name},我的性别${this.sex}`
}
 
const fun = myNew(Fun,'子君','男')
// 我的姓名子君，我的性别男
console.log(fun.getUserInfo())


function myNew(constructor, ...rest) {
if (typeof constructor !== 'function') {
      return constructor;
  }
  //创建新的对象,关联构造函数的原型对象
  const _constructor = Object.create(constructor.prototype);
  //执行构造函数, 并将第一步的对象作为构造函数的this上下文
  const obj = constructor.apply(_constructor, rest);
  //如果构造函数执行结果是对象则返回执行结果, 如果没有返回对象则返回第一步传创建的对象
  if (typeof obj === 'object') {
      return obj;
  } else {
      return _constructor;
  }
}
function Fun(name,sex) {
  this.name = name
  this.sex = sex
}
Fun.prototype.getUserInfo = function() {
  return `我的姓名${this.name},我的性别${this.sex}`
}

const fun = myNew(Fun,'子君','男')
// 我的姓名子君，我的性别男
console.log(fun.getUserInfo())