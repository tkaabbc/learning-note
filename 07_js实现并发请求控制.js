// 最多发出5个并发请求，5个中一有空闲就继续发出
// 题1: https://juejin.cn/post/6913493585363599373#comment
// 支持并发的调度器， 最多允许2两任务进行处理
// const scheduler = new Scheduler(2)
// scheduler.addTask(1, '1');   // 1s后输出’1'
// scheduler.addTask(2, '2');  // 2s后输出’2'
// scheduler.addTask(1, '3');  // 2s后输出’3'
// scheduler.addTask(1, '4');  // 3s后输出’4'
// scheduler.start();

/**
 * 思路：
 * 1.记录当前pending并发中的请求数
 * 2.主要是用一个队列维护被拦截的请求
 * 3.每一个请求完成后，都记得询问下队列中是否还有等待执行的请求，有就执行
 * 这样效果是始终有5个请求在pending，某一个请求完成了就往里再加一个请求
 * 
 * 1.一个delayedQueue队列维护被拦截的任务
 * 2.一个maxPendingNum常量记录pending进行中的任务
 * 3.一个函数pollTask负责在前一个任务成功/失败后就从delayedQueue中取出任务执行
 *  保证始终有max个任务在pending中
 */
class Scheduler {
  constructor(max) {
    this.delayedQueue = []
    this.maxPendingNum = max
    this.curPendingNum = 0
  }

  /** 模拟异步api请求 */
  asyncFn(timeout, text) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log(text);
        resolve()
      }, timeout * 1000);
    })
  }

  addTask(timeout, text) {
    this.delayedQueue.push(this.asyncFn.bind(null, timeout, text))
  }

  /** 执行队列中的任务 */
  runTask(fn) {
    this.curPendingNum++
    fn().then(() => {
      this.curPendingNum-- // 成功或者失败的时候都取出队列中下一个任务来执行
      this.pollTask()
    }, () => {
      this.curPendingNum--
      this.pollTask()
    })
  }

  /** 查询拦截队列是否还有任务需要被执行 */
  pollTask() {
    if (this.curPendingNum < this.maxPendingNum && this.delayedQueue.length) {
      this.runTask(this.delayedQueue.shift())
    }
  }
  start() {
    for (let i = 0; i < this.maxPendingNum; i++) {
      const fn = this.delayedQueue.shift()
      this.runTask(fn)
    }
  }
}
// 测试用例
// const scheduler = new Scheduler(14)
// scheduler.addTask(1, '1');   // 1s后输出’1'
// scheduler.addTask(2, '2');  // 2s后输出’2'
// scheduler.addTask(1, '3');  // 2s后输出’3'
// scheduler.addTask(1, '4');  // 3s后输出’4'
// scheduler.start();
// todo 去掉start，addTask时就调用；并且外部传入asyncFn更贴切日常业务请求

// 题目2: 另一种调用形式 https://juejin.cn/post/6844904085062156295