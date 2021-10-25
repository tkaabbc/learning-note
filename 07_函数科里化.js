// todo
// 实现add(1)(2)(3, 4) // 10
// 思路
// 主要是利用 return函数自身时会调用 toString方法
// 那我们就可以改写这个toString方法，让它return出值
function add(...arg) {
  const curry = (...arg2) => {
    arg.push(...arg2)
    console.log(arg);
    return curry
  }

  curry.toString = () => arg.reduce((total, num) => total + num)
  
  return curry
}
const a = add(1)(2,1)(5)
console.log(typeof a)
