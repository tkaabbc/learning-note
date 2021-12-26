// todo
/**
 * 继承方式演进 参考js高程第8章
 * 以下顺序是进化的顺序，一代更比一代强
 * 1.原型继承: 方法能继承，但问题是属性如果是引用类型会被所有子类共享
 * 2.盗用构造函数: 解决了属性被的问题，但方法必须在构造函数内定义才能继承，在外面通过prototype则没办法继承
 * 3.组合继承: （使用最多的方式）就是把上面两种结合起来，这样既可以把方法定义在原型上以实现重用，又可以让每个实例都有自己的属性。既解决了方法的继承，又解决了属性被共享的问题
 * 4.寄生式组合继承: (最佳模式) <3.组合继承>存在new两次构造函数的问题，导致效率低
 * todo：看看是手写3还是4，查一查资料看大家用哪种，4用object.create实现，好像培训班就是用这个
 */

// 寄生式组合继承 （这是最优的方式，背这个，考试写这个）
// 理解了原型链顺序和new之后，再回过头看继承就一目了然了
/**
 * 思路
 * 1继承父属性
 * 2继承父方法
 * 3保正constructor指向正确
 */
function Person(name, age) {
  this.name = name, // 定义父类上的属性
  this.age = age
}
Person.prototype.setAge = function () { // 定义父类上的方法
  console.log("111")
}
function Student(name, age, price) {
  Person.call(this, name, age) // 步骤1.使用 盗用构造函数法 继承属性
  this.price = price
  this.setScore = function () {}
}
// 步骤2.继承方法 这两行代码是寄生式组合继承的精髓，这里用了Object.create来创造原型，免去一次new
Student.prototype = Object.create(Person.prototype)//核心代码 //继承方法
Student.prototype.constructor = Student//核心代码 // 为了instanceof正确查找
var s1 = new Student('Tom', 20, 15000)
console.log(s1 instanceof Student, s1 instanceof Person) // true true
console.log(s1.constructor) //Student
console.log(s1)