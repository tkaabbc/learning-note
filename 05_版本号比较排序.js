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
 * 如果版本号位数不相等而前几位值一致, 则认为位数多的版本号大(位置上没有数字的相当于0)。
 * 参考：https://segmentfault.com/a/1190000023485915
 * 注意：该解法没有考虑 version1 = "1.0", version2 = "1.0.0"
 *  这种情况会被误判为位数多的版本号大
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

/**
 * @param {string} version1
 * @param {string} version2
 * @return {number}
 * https://leetcode-cn.com/problems/compare-version-numbers/
 */
 var compareVersion = function(version1, version2) {
  /**
   *  思路
      从左到右一个个比较，大的就大，相等就比下一位
      - 如果其中某个位置上没有数字，则要认为是0
      - 如果都没有数字，则说明相等
   */
  const arr1 = version1.split('.')
  const arr2 = version2.split('.')
  let i = 0
  while(true) {
    if (arr2[i] === undefined && arr1[i] === undefined) {
      return 0
    }
    if (arr1[i] === undefined) { // 某一位为0，则补上
      arr1[i] = '0'
    }
    if (arr2[i] === undefined) {
      arr2[i] = '0'
    }

    const v1 = Number(arr1[i])
    const v2 = Number(arr2[i])
    if (v1 > v2) {
      return 1
    } else if (v1 < v2) {
      return -1
    }
    i++
  }
};
