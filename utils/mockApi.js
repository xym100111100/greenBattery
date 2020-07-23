var Mock = require("./mock")

const MockData = {
    '/login/sign': (data) => {
      console.log(data)
      return Mock.mock({
        "code": 0,
        'msg': '登录成功',
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

function MockApi(url,data) {
   let res =  MockData[url]
   if(res){
        return res(data)
   }
}



module.exports = MockApi