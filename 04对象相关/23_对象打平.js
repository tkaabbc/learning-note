var entryObj = {
  a: {
      b: {
          c: {
              d: 'abcdd'
          }
      },
      e: [0, 1, { f: 'fff' }],
      g: 'ae'
  },
  h: 'hhh'
}

/**
 * 思路
 * 关键
 * 判断对象/数组
 * 遍历对象/数组
 * 递归遍历
 * 
 * Object.prototype.toString.call({}) // '[object Object]'
 * Object.prototype.toString.call([]) // '[object Array]'
 * @param {}} obj 
 */
function flattenObj(obj) {
  const result = {}
  const helper = (prevKey, value) => {
    // 是数组
    if (Array.isArray(value)) {
      value.forEach((ele, i) => {
        helper(`${prevKey}[${i}]`, ele)
      })
    } else if (Object.prototype.toString.call(value) === '[object Object]') {
      // 是对象
      for (const [key, val] of Object.entries(value)) {
        helper(`${prevKey}.${key}`, val)
      }
    } else {
      result[prevKey] = value
    }
  }
  for (const [key, val] of Object.entries(obj)) {
    helper(key, val)
  }
  return result
}
console.log(flattenObj(entryObj));
