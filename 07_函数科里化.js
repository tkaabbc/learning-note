// todo
// 实现add(1)(2)(3, 4) // 10
// 思路
// 主要是利用 return函数自身时会调用 toString方法
// 那我们就可以改写这个toString方法，让它return出值
// 这个方法好像有点问题，先看底下的方法
function add(...arg) {
  const curry = (...arg2) => {
    arg.push(...arg2) // 每次调用的参数存在arg闭包里
    // console.log(arg);
    return curry
  }

  curry.toString = () => arg.reduce((total, num) => total + num)
  
  return curry
}
const a = add(1)(2,1)(5)
console.log(typeof a)

/**
 * 思路
 * 1利用闭包存每次调用的参数
 * 2若传参则返回函数本身
 * 3若不传参数就表示要return计算结果
 */
const operate = (...args) => {
  let params = [...args]
  const _add = (...args1) => {
    params = [...params, ...args1]
    if (args1.length > 0) {
      return _add
    } else {
      return params.reduce((a, b) => a + b, 0)
    }
  }
  return _add
}

console.log(operate(1, 2)(3, 5, 2)())

// 意义应用参考https://www.zhangxinxu.com/wordpress/2013/02/js-currying/