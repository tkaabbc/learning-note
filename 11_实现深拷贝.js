// 链接：https://juejin.cn/post/6844903929705136141
/**
 * 实现深拷贝注意点：
 * 1.要考虑到对象的循环引用问题 target.target = target
 * 2.函数的原型处理。一般不需要拷贝函数，lodash中判断是函数也是直接返回本身
 * 
 * // 这里用map解决循环引用
   // 用Map存对象的地址，如果拷贝过这个对象，就直接返回
   // 有 - 直接返回
   // 没有 - 将当前对象作为key，克隆对象作为value进行存储
 * @param {*} target 
 * @returns 
 */
function clone(target, map = new Map()) {
  // 需要递归遍历的类型 object, array, map, set
  if (typeof target === 'object') {
    let cloneTarget = Array.isArray(target) ? [] : {};

    if (map.get(target)) {
      return map.get(target); // 遇到循环引用直接返回自身
    }
    map.set(target, cloneTarget);

    for (const key in target) { // 这里可以针对对象和数组优化成效率更高的遍历
      cloneTarget[key] = clone(target[key], map);
    }
    return cloneTarget;
  } else {
    return target;
  }

  // 不需要递归遍历的类型 Bool、Number、String、String、Date、Error这几种类型我们都可以直接用构造函数和原始数据创建一个新对象
  // todo上面只实现了数组和对象的递归，还有别的类型需要考虑
};
