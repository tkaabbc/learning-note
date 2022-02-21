/**
 * 答案两次都是'极客时间'
 * 相同的函数声明，后面覆盖前面，只留最后的
 */
function showName() {
  console.log('极客邦');
}
showName(); // '极客时间'
function showName() {
  console.log('极客时间');
}
showName(); // '极客时间'



/**
 * 答案是1
 * 变量和函数同名，不管先后顺序
 * 保留function showName
 * 忽略变量声明var showName
 */
 showName()
 function showName() {
     console.log(1)
 }
 var showName = function() {
     console.log(2)
 }
 /**
  * 总结
  * 下面是关于同名变量和函数的两点处理原则：
  * 1:如果是同名的函数，JavaScript编译阶段会选择最后声明的那个。
  * 2:如果变量和函数同名，那么在编译阶段，变量的声明会被忽略，不管先后顺序！
  */