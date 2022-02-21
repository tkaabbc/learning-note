// todo 参考 http://www.zhangyunling.com/207.html
class Jq {
  constructor(param) {
    this.value = 0
  }
  add(num) {
    this.value+=num
    return this
  }
  getAns() {
    return this.value
  }
}
const $ = new Jq()
const ans = $.add(1).add(2).add(5).getAns()
console.log(ans);
const $2 = new Jq()
const ans2 = $2.add(11).add(12).add(5).getAns()
console.log(ans2);