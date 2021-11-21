// https://www.jianshu.com/p/356f10ee476d
/**
 * 思路
 * 三种方法
 * 1.在单个promise中用catch中对失败做处理
 * 2.失败也resolve；不reject的话all就收不到reject
 * 3.用Primise.allSettled
 */

// 方法一：在单个的catch中对失败的promise请求做处理
function getData(api){
  return new Promise((resolve,reject) => {
    setTimeout(() => {
      var ok = Math.random() > 0.5  // 模拟请求成功或失败
      if(ok)
        resolve('get ' + api + ' data')
      else{
        reject('error') // 正常的reject
      }
    },2000)
  })
}
function getDatas(arr){
  var promises = arr.map(item => getData(item))
  // 关键步骤，map(p => p.catch(e => e)) 在每个请求后加上 catch 捕获错误；
  return Promise.all(promises.map(p => p.catch(e => e))).then(values => { 
    values.map((v,index) => {
      if(v == 'error'){
        console.log('第' + (index+1) + '个请求失败')
      }else{
        console.log(v)
      }
    })
  }).catch(error => {
    console.log(error)
  })
}
getDatas(['./api1','./api2','./api3','./api4']).then(() => '请求结束')

// 方法二：单个promise中错误时也resolve，统一交给all处理
function getData(api){
  return new Promise((resolve,reject) => {
    setTimeout(() => {
      var ok = Math.random() > 0.5  // 模拟请求成功或失败
      if(ok)
        resolve('get ' + api + ' data')
      else{
        // reject(api + ' fail')   // 如果调用reject就会使Promise.all()进行失败回调
        resolve('error')    // Promise all的时候做判断  如果是'error'则说明这条请求失败
      }
    },2000)
  })
}
function getDatas(arr){
  var promises = arr.map(item => getData(item))
  return Promise.all(promises).then(values => {
    values.map((v,index) => {
      if(v == 'error'){
        console.log('第' + (index+1) + '个请求失败')
      }else{
        console.log(v)
      }
    })
  }).catch(error => {
    console.log(error)
  })
}
getDatas(['./api1','./api2','./api3','./api4']).then(() => '请求结束')

// 方法三：Primise.allSettled
Promise.allSettled([promise1,promise2,promise3,promise4]).then(function(args){
  console.log(args);
  /*
  result: 
  [
    {"status":"rejected","reason":"promise1"}, 
    {"status":"fulfilled","value":"promise2"},
    {"status":"fulfilled","value":"promise3"}, 
    {"status":"rejected","reason":"promise4"}
  ]*/
})