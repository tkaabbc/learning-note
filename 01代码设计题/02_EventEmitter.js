// EventEmitter是node的一个模块
// http://nodejs.cn/api/events.html#events_emitter_removelistener_eventname_listener

/**
 * 总结
 * 其实就是先把要执行的回调存起来（on），到了合适时机想让它执行的时候就去找出这个回调并执行（emit）
 */

class EventEmitter {
  constructor() {
    this.events = {}
    // events的数据结构是这样的：
    // this.events = {
    //   'event1': [fn1, fn2],
    //   'event2': [fn3],
    // }
  }

  /**
   * 注册事件
   */
  on(eventName, cb) {
    if (this.events[eventName]) { // 判断是否注册过事件，一个事件名下可以有多个回调函数
      this.events[eventName].push(cb)
    } else {
      this.events[eventName] = [cb]
    }
  }

  /**
   * 只执行一次就解绑
   */
  once(eventName, cb) {
    const onceHandler = (...params) => {
      cb(...params)
      this.off(eventName, onceHandler) // 注意 这里off传的是onceHandler自己，因为下面on传的就是onceHandler
    }
    this.on(eventName, onceHandler)
  }

  /**
   * 触发事件
   */
  emit(eventName, ...params) {
    this.events[eventName].forEach(cb => cb(...params)) // 剩余参数原封不动传递
  }

  /**
   * 解绑单个eventName下的单个cb
   */
  off(eventName, cb) {
    if (this.events[eventName]) { 
      const i = this.events[eventName].indexOf(cb) //原理是传入on注册时同一个cb的引用，在this.events中找到该cb并剔除
      i > -1 && this.events[eventName].splice(i, 1)
    }
  }
}

// // 运行示例
let event = new EventEmitter();

const cb1 = function(name, age) {
  console.log(name, age);
}
event.on('say', cb1);

// event.once('say', function(str) {
//   console.log('这是once:' + str)
// })

event.emit('say','1visa', 18);
event.emit('say','2visa', 66);
event.off('say', cb1);
event.emit('say','3visa');
