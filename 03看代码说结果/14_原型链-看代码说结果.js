// 原型链
function foo() {

}

const bar = new foo()

console.log(1, bar.__proto__) // foo.prototype
console.log(2, bar.__proto__.__proto__) // Object.prototype
console.log(3, bar.__proto__.__proto__.__proto__) // null
console.log(4, bar.__proto__.__proto__.__proto__.__proto__) // 报错
console.log(5, foo.prototype) // { constructor: foo } 有constructor属性的对象
console.log(6, foo.prototype.prototype) // undefined
console.log(7, foo.prototype.prototype.prototype) // 报错


// 词法作用域
var a = 20;

function bar() {
  console.log(a);
}

function foo(fn) {
  var a = 10;
  fn();
}
foo(bar); // 20

