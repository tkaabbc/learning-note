// finally 中 return一个promise时，会先等这个promise执行完
// then也有这个功能
// 例子
new Promise((resolve) => {resolve(1)}).finally(() => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
      console.log('timeout') // 先打印
    }, 3000);
  })
}).then(() => console.log('wait timeout')) // 后打印
