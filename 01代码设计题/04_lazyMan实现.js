// 实现一个 LazyMan，可以按照以下方式调用：
// LazyMan("Hank") 输出：
// Hi! This is Hank!
// LazyMan("Hank").sleep(10).eat("dinner") 输出
// Hi! This is Hank!
// //等待 10 秒。.
// Wake up after 10
// Eat dinner~
// LazyMan("Hank").eat("dinner").eat("supper") 输出
// Hi This is Hank!
// Eat dinner~
// Eat supper~
// LazyMan("Hank").sleepFirst(5).eat("supper") 输出
// //等待 5 秒
// Wake up after 5
// Hi This is Hank!
// Eat supper
// 以此类推。

// 知识点：任务队列 链式调用 js代码执行顺序

// 任务队列设计 1.一个队列 2.每个任务执行结束都执行this.next执行出队列操作
// 链式调用：retur this

// 总结
// 前置知识
// 1.js先从上到下执行完同步代码 才会去执行settimeout等异步代码
// 2.constructor中的代码在new的时候会被执行

// 应用到这题就是：new MyLazyMan('wtk').eat("dinner").sleep(5) 的执行顺序是
// constructor中的同步代码（settimeout中的不会执行） --> eat("dinner")中的同步代码 --> sleep(5)中的同步代码
// 一句话就是先往this.tasks中加好任务，利用settimeout在下一个事件循环启动任务

// 参考
// http://natumsol.men/lazyman/
// https://juejin.cn/post/6844903791188246541
// 另外有一个不自己写任务队列的实现在2中

/**
 * 思路
 * 1.用任务队列存储声明的任务，在任务回调中用this.next()触发下一个任务的执行
 * 2.this.next就是把队头的元素拿出来执行，所以有需要提前执行的任务就unshift到队头
 */
class MyLazyMan {
  constructor(arg) {
    this.tasks = [] // 任务队列，先进先出
    this.tasks.push(
      () => {
        console.log(`Hi This is ${arg}`)
        this.next()
      }
    )
    setTimeout(() => { // 在下一个事件循环启动任务
      this.next()
    }, 0);
  }

  eat(arg) {
    this.tasks.push(
      () => {
        console.log(`Eat ${arg}`)
        this.next()
      }
    )
    return this // 实现链式调用
  }

  sleep(arg) {
    this.tasks.push(
      () => {
        setTimeout(() => {
          console.log(`Wake up after ${arg}`)
          this.next()
        }, arg * 1000);
      }
    )
    return this
  }

  sleepFirst(arg) {
    this.tasks.unshift(
      () => {
        setTimeout(() => {
          console.log(`Wake up after ${arg}`)
          this.next()
        }, arg * 1000);
      }
    )
    return this
  }

  next() {
    const fn = this.tasks.shift()
    fn && fn()
  }
}

// test
// new MyLazyMan('wtk').sleep(10).eat("dinner")
// new MyLazyMan('wtk').eat("dinner").sleep(5)
// new MyLazyMan('wtk').eat("dinner").sleep(5).sleepFirst(3)
const myMan = new MyLazyMan('wtk')
myMan.sleepFirst(3)