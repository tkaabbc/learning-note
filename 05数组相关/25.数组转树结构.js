/**
 * 数组转树结构，pid=0代表树的根节点
let arr = [
    {id: 1, name: '部门1', pid: 0},
    {id: 2, name: '部门2', pid: 1},
    {id: 3, name: '部门3', pid: 1},
    {id: 4, name: '部门4', pid: 3},
    {id: 5, name: '部门5', pid: 4},
]

输出结果
[
    {
        "id": 1,
        "name": "部门1",
        "pid": 0,
        "children": [
            {
                "id": 2,
                "name": "部门2",
                "pid": 1,
                "children": []
            },
            {
                "id": 3,
                "name": "部门3",
                "pid": 1,
                "children": [
                    // 结果 ,,,
                ]
            }
        ]
    }
]
参考https://juejin.cn/post/6983904373508145189#heading-6
 */


/**
 * 思路：
 * 递归，未优化；
 * 从id=1的children开始，找到所有元素的childre的子元素填充进去；
 * 再对children的子元素重复上面的步骤；
 * 时间复杂度较高
 * @param {*} arr 
 */
function arrayToTree(arr) {
  const result = []
  
  for (const ele of arr) { // 先找到根节点 id === 1
    if (ele.id === 1) {
      result.push({...ele, children: []})
      break
    }
  }
  function setChildren(parent) { // 再填充每个节点的children
    for (const ele of arr) {
      if (ele.pid === parent.id) {
        const newItem = {...ele, children: []}
        parent.children.push({...ele, children: []})
        setChildren(newItem) // 并对children的子元素也递归调用
      }
    }
  }
  setChildren(result[0])
  console.log(result);
}

// -----------------------------------------------------------
/**
 * 优化思路
 * 可用id当key 在tempMap中存arr
 * 利用对象引用的特点 直接修改tempMap上的children
 * 时间复杂度2n
 */
function arrayToTree(arr) {
  const result = []
  const tempMap = {}
  for (const ele of arr) {
    tempMap[ele.id] = {...ele, children: []} // 转成对象存，键是id，

    if (ele.id === 1) { // 找到根节点 id === 1
      result.push(tempMap[ele.id])
    }
  }

  for (const ele of arr) {
    const id = ele.id
    const pid = ele.pid
    if (pid !== 0) {
      tempMap[pid].children.push(tempMap[id])
    }
  }
  
  console.log(result);
}

// 测试用例
let arr = [
  {id: 1, name: '部门1', pid: 0},
  {id: 2, name: '部门2', pid: 1},
  {id: 3, name: '部门3', pid: 1},
  {id: 4, name: '部门4', pid: 3},
  {id: 5, name: '部门5', pid: 4},
]
arrayToTree(arr)
