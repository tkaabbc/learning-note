/**
 * 思路
 * 如果是 对象/数组 就进行递归判断
 * 类似深拷贝的思路
 */
function deepEqual(object1, object2) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const val1 = object1[key];
    const val2 = object2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if (
      (areObjects && !deepEqual(val1, val2)) ||
      (!areObjects && val1 !== val2)
    ) {
      return false;
    }
  }

  return true;
}

function isObject(object) {
  // 这里不考虑函数的情况，只考虑数组和对象
  return object != null && typeof object === "object";
}

// 作者：黄子毅
// 链接：https://juejin.cn/post/6846687597436076046
// 来源：稀土掘金
// 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。