var myObj = {
  name : "极客时间", 
  showThis: {
    name: 'childe',
    showChild: function () {
      console.log(this)
    }
  }
}
// 输出showThis对象
myObj.showThis.showChild() 

// 输出window对象
let fn = myObj.showThis.showChild
fn()
// 总结：谁调用指向谁
// 改变this的方法
/**
 * 1.var self = this
 * 2.bind/calll/apply; bind绑定后就定死了，bind/call/apply也不能改
 * 3.箭头函数
 */