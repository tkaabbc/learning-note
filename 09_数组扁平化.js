// 法1: es6 的flat
let a = [1,[2,3,[4,[5]]]];  
a.flat(Infinity); // [1,2,3,4,5]  a是4维数组

// 法2: 递归法
function myFlat(arr) {
  let result = []
  for (let i = 0; i < arr.length; i++) {
    const element = arr[i];
    if (Array.isArray(element)) {
      result = [...result, ...myFlat(element)]
    } else {
      result.push(element)
    }
  }
  return result
}
console.log(myFlat(a));