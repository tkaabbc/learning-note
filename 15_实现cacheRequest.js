// todo
// 参考
// https://juejin.cn/post/6968487137670856711#comment
// 
// https://juejin.cn/post/6844904097976418317
// 基于作者的看看如何实现pending中的请求不发起的功能

/**
 * 基础版本
 * 缺前一个请求未返回时，后续的请求要等之前的回来使用之前的数据
 * 
 * 完整版核心思路(有待用class改写)
 * 1用一个map存下已经请求过的数据 记录返回值、多余的请求的promise.resolve回调
 * 2发起请求前判断状态，当遇到pending时，也返回个promise，但是把该promise的resolve推入队列中存起来，
 *  等请求回来后通知notify清空resolves队列
 * 主要就是这几个部件
 * cacheRequest // 判断有木有发过
 * handleRequest // 发请求
 * notify // 通知
 * memo // 存结果
 * [
 *  url,
 *  {
 *    data,
 *    resolves,
 *    rejects,
 *  }
 * ]
 * 
 */
// 构建Map，用作缓存数据
const memo = new Map()
const PENDING = 'pending'
// 这里简单的把url作为cacheKey
const cacheRquest = (url) => {
  // 封装一个promise方便外面调用
  return new Promise((resolve, reject) => {
    if (memo.has(url)) {
      const { data, status } = memo.get(url)
      if (status === PENDING) {
        return
      } else {
        resolve(data)
      }
    } else {
      memo.set(url, {
        status: PENDING,
        data: null,
      })
      // 无缓存，发起真实请求，成功后写入缓存
      fetch(url).then(res => {
        memo.set(url, {
          status: 'success',
          data: res,
        })
        resolve(res)
      }).catch(err => reject(err))
    }
  })
}


/**
 * 完整版
 */
 (function (global, request) {

  // 用于存放缓存数据
  const memo = new Map()

  const setCache = (cacheKey, info) => {
    memo.set(cacheKey, info)
  }

  const notify = (cacheKey, value) => {
    const info = memo.get(cacheKey)

    let queue = []

    if (info.status === 'SUCCESS') {
      queue = info.resolves
    } else if (info.status === 'FAIL') {
      queue = info.rejects
    }

    while(queue.length) {
      const cb = queue.shift()
      cb(value)
    }

    setCache(cacheKey, { resolves: [], rejects: [] })
  }

  const handleRequest = (url, cacheKey) => {
    setCache(cacheKey, { 
      status: 'PENDING',
      resolves: [],
      rejects: []
    })

    const ret = request(url)

    return ret.then(res => {
      // 返回成功，刷新缓存，广播并发队列
      setCache(cacheKey, {
        status: 'SUCCESS',
        response: res
      })
      notify(cacheKey, res)
      return Promise.resolve(res)
    }).catch(err => {
      // 返回失败，刷新缓存，广播错误信息
      setCache(cacheKey, { status: 'FAIL' })
      notify(cacheKey, err)
      return Promise.reject(err)
    })
  }

  /**
   * 缓存式请求
   * @param {String} target 请求地址
   * @param {Object} option 缓存的配置项
   * @returns {Promise}
   */
  const cacheRequest = function (target, option = {}) {
    const cacheKey = option.cacheKey || target

    const cacheInfo = memo.get(cacheKey)

    if (!cacheInfo) {
      return handleRequest(target, cacheKey)
    }

    const status = cacheInfo.status
    // 已缓存成功数据，则返回
    if (status === 'SUCCESS') {
      return Promise.resolve(cacheInfo.response)
    }
    // 缓存正在PENDING时，封装单独异步操作，加入队列
    if (status === 'PENDING') {
      return new Promise((resolve, reject) => {
        cacheInfo.resolves.push(resolve)
        cacheInfo.rejects.push(reject)
      })
    }
    // 缓存的请求失败时，重新发起真实请求
    return handleRequest(target, cacheKey)
  }

  global.cacheRequest = cacheRequest
})(this, fetch)