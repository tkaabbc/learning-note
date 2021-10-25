const arr = [
  '1.1',
  '2.3.3',
  '4.3.5',
  '0.3.1',
  '0.302.1',
  '4.20.0',
  '4.3.5.1',
  '1.2.3.4.5'
];

/** 
 * 思路:
 * 逐位比较子版本号：如果当前版本号相同则比较下一位；
 * 如果版本号位数不相等而前几位值一致, 则认为位数多的版本号大。
 * 参考：https://segmentfault.com/a/1190000023485915
 */
arr.sort((a, b) => {
  let i = 0;
  const arr1 = a.split('.');
  const arr2 = b.split('.');

  while (true) {
    const s1 = arr1[i];
    const s2 = arr2[i];
    i++

    // 前几位都一样，则位数多的版本号大
    if (s1 === undefined || s2 === undefined) {
      return arr2.length - arr1.length;
    }

    if (s1 === s2) continue;

    // Array.sort
    // 若返回值小于0，则a排到b前面
    // 若大于0，则b在a前面
    // 如果s2 
    return s2 - s1;
  }
});

console.log(arr)