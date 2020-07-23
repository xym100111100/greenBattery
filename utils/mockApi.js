var Mock = require("./mock")
const userInfo = {
  '18278904219': {
    code: 0,
    data: {
      token: "14a2d93b-6ada-4cc2-aa8c-b3a6d67ba2a4",
      info: {
        phone:'18278904219',
        adminUserNo: "1268793259442966528",
        userName:'杰克',
        roles: [{
          roleNo: "111",
          roleName: "admin",
        }]
      }
    }
  },
  '18707895796': {
    code: 0,
    data: {
      userName:'小明',
      token: "14a2d93b-6ada-4cc2-aa8c-b3a6d67ba2a4",
      info: {
        adminUserNo: "1268793259442966528",
        phone:'18707895796',
        roles: [{
          roleNo: "111",
          roleName: "edit",
        }]
      }
    }
  }
}
const MockData = {
  '/login/sign': (data) => {
    console.log(data)
    return userInfo[data.phone]
  },
  '/bd/getBDInfoList': (data) => {
    return Mock.mock({
      "code": 0,
      'msg': '操作成功',
      "data|10": [{
        "id|+1": 1,
        "img": '@image("200x100", "#4A7BF7","#fff","pic")',
        "title": "@ctitle(3,8)",
        "city": "@county(true)",
        "stock_num": "@integer(0,100)", //库存数量  
        "marketing_start": "@datetime()",
        "marketing_stop": "@now()",
        "price": "@integer(100,2000)", //现价，单位：分  
        "original_price": "@integer(100,3000)"
      }]
    })
  }

}

function MockApi(url, data) {
  let res = MockData[url]
  if (res) {
    return res(data)
  }
}



module.exports = MockApi