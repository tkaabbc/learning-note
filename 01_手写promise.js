// Promise规范（手写包含的功能点）：
// 一，then()要返回一个promise
// 二，值要透传：可以then().then()
//  1.普通值都透传给下一个then: 
//    then(() => return 1).then((val) => console.log(val) // 1)
//    相当于(return new Promise((resolve, reject) => resolve(1))).then((val) => console.log(val) // 1)
//    如果then中return了一个promise，就取这个promise的结果(onFulfilled/onRejected的运行结果)传递下去
//  2.throw error会传给catch：
//    相当于reject(error)
//  3.阻止传给下一个then的办法：
//    then(() => return new Promise())；即return一个空promise

// 三，状态：Promise对象的状态改变，只有两种可能：从pending变为fulfilled和从pending变为rejected。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果
// 四，对象的状态不受外界影响，只有new Promise时的代码能修改；这也是Promise这个名字的由来，它的英语意思就是“承诺”，表示其他手段无法改变



// 注意：
// 区别 ‘then()的返回值为promise’ 和 ‘then(onFulfilled, onRejected)中的onFulfilled的返回值为promise’ 的区别
//    前者为了能then().then()
//    后者是规定若onFulfilled返回值为一个promise，则要等待onFulfilled的promise结果确定(resolve/reject),下一个then才会调用

// Promise缺点：
//    1.无法取消Promise，一旦新建它就会立即执行，无法中途取消
//    2.Promise内部抛出的错误，不会反应到外部，只能promise提供的回调api捕获

// 主流程总结：
// 第一步.new Promise中的代码executor要立即执行
// 第二步.实现then()用到发布订阅模式：分两种情况
//  1.executor为异步时，then/catch传的方法会被加入回调队列中，等resolve/reject触发时才执行这些回调
//  2.executor为同步时，then中传的方法直接执行就行

const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';

// 核心：判断x是否为promise
const resolvePromise = (promise2, x, resolve, reject) => {
  if (promise2 === x) { // 引用自己（循环引用）直接报错
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  let called; // 防止二次调用
  if ((typeof x === 'object' && x != null) || typeof x === 'function') { // 认为它是promise
    try {
      let then = x.then; // 取then方法
      if (typeof then === 'function') { // 有then 则姑且认为它是个promise，就要把这个promise的结果传给下一个
        then.call(x, y => { // 这是规范要求 x作为this去调用then
          if (called) return;
          called = true;
          resolvePromise(promise2, y, resolve, reject); 
        }, r => {
          if (called) return;
          called = true;
          reject(r);
        });
      } else {
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e)
    }
  } else {
    resolve(x) // 如果不用考虑promise的情况直接执行这行就行
  }
}

class Promise {
  constructor(executor) { // executor执行器要立刻执行
    this.status = PENDING;
    this.value = undefined; // 用来存传给resolve的值
    this.reason = undefined; // 用来存失败原因
    this.onResolvedCallbacks = []; // 用来存成功的回调
    this.onRejectedCallbacks= []; // 用来存失败的回调

    let resolve = (value) => { // 只有resolve/reject这两个方法能改变promise的状态
      if(value instanceof Promise){ // 如果为promise，会等待这个promise执行完后再继续执行
        return value.then(resolve,reject)
      }

      if(this.status ===  PENDING) { // 状态只能从PENDING到FULFILLED/REJECTED，并且一旦变到了FULFILLED/REJECTED就不可再变
        this.status = FULFILLED;
        this.value = value;
        this.onResolvedCallbacks.forEach(fn=>fn());
      }
    } 

    let reject = (reason) => {
      if(this.status ===  PENDING) {
        this.status = REJECTED;
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn=>fn());
      }
    }

    try {
      executor(resolve,reject)
    } catch (error) {
      reject(error)
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v; // 做值传递，如果then不传参数，就把结果传给下一个then/catch
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };
    let promise2 = new Promise((resolve, reject) => { // then()要返回一个promise
      if (this.status === FULFILLED) { // 走到这，说明excutor中跑的是同步代码 且成功；直接执行成功的回调onFulfilled就行
        setTimeout(() => { // 加settimeout原因：规范规定onFulfilled, onRejected不能在当前上下文（context）执行；也就是说then是异步执行的；
          try { // 加try catch原因：捕获onFulfilled, onRejected中的错误
            let x = onFulfilled(this.value); // x等价于 在使用时then第一个参数return的值
            resolvePromise(promise2, x, resolve, reject); // 兼容 x 为 promise 情况
          } catch (e) {
            reject(e)
          }
        }, 0);
      }

      if (this.status === REJECTED) { // 同步代码 失败
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e)
          }
        }, 0);
      }

      if (this.status === PENDING) { // 走到这说明excutor跑的是异步代码；与同步的唯一区别是要把成功的回调推入onResolvedCallbacks栈中，等异步成功后在resolve中清空栈
        this.onResolvedCallbacks.push(() => { // 这里包层函数是为了给onFulfilled传this.value
          setTimeout(() => { // setTimeout是为了模拟promise的微任务
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e)
            }
          }, 0);
        });

        this.onRejectedCallbacks.push(()=> {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0);
        });
      }
    });
  
    return promise2;
  }

  catch(errCallback) {
    return this.then(null,errCallback)
  }

  // finally功能点 
  // 1.透传 cb只单纯执行
  // 2.finally位置可以任意放(说明返回的是promise)
  // 3.如果上一个人成功就把成功结果往下传，失败就把失败往下传，只执行一下传给finally的cb
  // 4.如果finally中return一个promise，则会等这个promise执行完再执行下一个then/catch

  // 解释：
  // 1.Promise.resolve(callback()).then(()=>value)
  //    如果callback()为普通值，会被包装成promise；
  //    如果为promise，会等待这个promise执行完后再继续执行

  // 感悟：
  // 本质就是执行和透传，唯一难的就是要考虑cb中return了一个promise的情况

  finally(callback) {
    return this.then((value)=>{
      return Promise.resolve(callback()).then(()=>value) // Promise.resolve 为了兼容callback中return一个promise的情况，Promise.resolvee能等待callback中的异步代码执行完
    },(reason)=>{
      return Promise.resolve(callback()).then(()=>{throw reason})
    })
  }
  
  // 不考虑cb为promise的话这样写就行，加上兼容就变成上面👆
  finally(cb) {
    return this.then((value)=>{
      cb()
      return value
    },(reason)=>{
      cb()
      throw reason
    })
  }

  static resolve(data){ // 把对象转成promise
    return new Promise((resolve,reject)=>{
      resolve(data);
    })
  }

  static reject(reason){
    return new Promise((resolve,reject)=>{
      reject(reason);
    })
  } 

  // all功能点：
  //    1.all()返回值是个promise，通过then取到成功结果（数组）
  //    2.全部成功才成功，任何一个失败就reject抛出
  // 思路：
  //    1.forEach把所有的输入values调用一遍
  //    2.非promise的value直接返回
  //    3.成功结果的数量和输入的数量相等才resolve

  static all(values) {
    if (!Array.isArray(values)) {
      const type = typeof values;
      return new TypeError(`TypeError: ${type} ${values} is not iterable`)
    }

    return new Promise((resolve, reject) => {
      let resultArr = [];
      let orderIndex = 0; // 用来计数结果个数
      const processResultByKey = (value, index) => { // 用来记录结果
        resultArr[index] = value;
        if (++orderIndex === values.length) { // 结果都好了再resolve
            resolve(resultArr)
        }
      }
      for (let i = 0; i < values.length; i++) {
        let value = values[i];
        if (value && typeof value.then === 'function') { // 判断是promise
          value.then((value) => {
            processResultByKey(value, i);
          }, reject);
        } else {
          processResultByKey(value, i); // 不是promise直接返回本身
        }
      }
    });
  }

  static race(promises) {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        let val = promises[i];
        if (val && typeof val.then === 'function') {
          val.then(resolve, reject);
        } else {
          resolve(val)
        }
      }
    });
  }
}


// 跑promise测试用例用
// Promise.defer 可以解决new Promise封装时嵌套的问题；
//  不是标准的方法，但很多库都实现了defer
Promise.defer = Promise.deferred = function () {
  let dtd = {}
  dtd.promise = new Promise((resolve, reject) => {
    dtd.resolve = resolve;
    dtd.reject = reject;
  })
  return dtd;
}

module.exports = Promise

// 参考https://www.bilibili.com/video/BV1sZ4y1j71K?t=308
