// todo
// 参考
// https://juejin.cn/post/6968487137670856711#comment
// 
// https://juejin.cn/post/6844904097976418317
// 基于作者的看看如何实现pending中的请求不发起的功能

/**
 * 基础版本
 * 缺前一个请求未返回时，会发出第二个请求的限制
 */
// 构建Map，用作缓存数据
const dict = new Map()
// 这里简单的把url作为cacheKey
const cacheRquest = (url) => {
  if (dict.has(url)) {
    return Promise.resolve(dict.get(url))
  } else {
    // 无缓存，发起真实请求，成功后写入缓存
    return request(url).then(res => {
      dict.set(url, res)
      return res
    }).catch(err => Promise.reject(err))
  }
}


/**
 * u need axios
 * 请注意此处使用axios作为请求库
 */
 (function (global, request) {

  // 用于存放缓存数据
  const dict = new Map()

  const setCache = (cacheKey, info) => {
    dict.set(cacheKey, {
      ...(dict.get(cacheKey) || {}),
      ...info
    })
  }

  const notify = (cacheKey, value) => {
    const info = dict.get(cacheKey)

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

    const cacheInfo = dict.get(cacheKey)

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
})(this, axios)