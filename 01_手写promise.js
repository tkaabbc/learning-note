// then的返回值情况：
// 1.阻止传给下一个then的办法：return new Promise()
// 2.throw error会传给catch
// 3.其余普通值都透传给then

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
      if (typeof then === 'function') { // 有then 则姑且认为它是个promise
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
    resolve(x)
  }
}

class Promise {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks= [];

    let resolve = (value) => {
      if(value instanceof Promise){
        return value.then(resolve,reject)
      }

      if(this.status ===  PENDING) {
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
    let promise2 = new Promise((resolve, reject) => { // then中要返回一个promise
      if (this.status === FULFILLED) {
        setTimeout(() => { // 加settimeout原因：规范规定onFulfilled, onRejected不能在当前上下文（context）执行；也就是说then是异步执行的；
          try { // 加try catch原因：捕获onFulfilled, onRejected中的错误
            let x = onFulfilled(this.value); // x等价于 在使用时then第一个参数return的值
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e)
          }
        }, 0);
      }

      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e)
          }
        }, 0);
      }

      if (this.status === PENDING) {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
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

  finally(callback) {
    return this.then((value)=>{
      return Promise.resolve(callback()).then(()=>value)
    },(reason)=>{
      return Promise.resolve(callback()).then(()=>{throw reason})
    })  
  }

  static resolve(data){
    return new Promise((resolve,reject)=>{
      resolve(data);
    })
  }

  static reject(reason){
    return new Promise((resolve,reject)=>{
      reject(reason);
    })
  } 

  static all(values) {
    if (!Array.isArray(values)) {
      const type = typeof values;
      return new TypeError(`TypeError: ${type} ${values} is not iterable`)
    }

    return new Promise((resolve, reject) => {
      let resultArr = [];
      let orderIndex = 0;
      const processResultByKey = (value, index) => {
        resultArr[index] = value;
        if (++orderIndex === values.length) {
            resolve(resultArr)
        }
      }
      for (let i = 0; i < values.length; i++) {
        let value = values[i];
        if (value && typeof value.then === 'function') {
          value.then((value) => {
            processResultByKey(value, i);
          }, reject);
        } else {
          processResultByKey(value, i);
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



Promise.defer = Promise.deferred = function () {
  let dtd = {}
  dtd.promise = new Promise((resolve, reject) => {
    dtd.resolve = resolve;
    dtd.reject = reject;
  })
  return dtd;
}

module.exports = Promise