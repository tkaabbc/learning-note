/** 去重思路大同小异
 * 思路
 * 常规肯定要有至少一层for遍历
 * 用indexOf可以少一层for遍历
 */

// 方法一 两层for嵌套
function unique(arr) {
  const result = arr.slice()
  for (let j = 0; j < arr.length; j++) {
    for (let i = j + 1; i < arr.length; i++) {
      if (result[i] === result[j]) {
        result.splice(i, 1)
      }
    }
  }
  return result
}

// 方法二 for+indexOf
function unique(arr) {
  const result = []
  for (let i = 0; i < arr.length; i++) {
    if (!result.indexOf(arr[i])) {
      result.push(arr[i])
    }
  }
  return result
}

// 方法三 用set数据结构
function unique(arr) {
  return [...new Set(arr)]
}

console.log(unique([1,1,2,3,4,4]));