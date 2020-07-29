var Mock = require("./mock")
const userInfo = {
  '18278904219': {
    code: 0,
    data: {
      token: "14a2d93b-6ada-4cc2-aa8c-b3a6d67ba2a4",
      info: {
        phone: '18278904219',
        busiPass: 1,
        busiNo: 123,
        adminUserNo: "1268793259442966528",
        userName: '杰克',
        type: 1,
        role:2,
        roles: [{
          roleNo: "111",
          roleName: "admin",
        }]
      }
    }
  },
  '18278904218': {
    code: 0,
    data: {
      token: "14a2d93b-6ada-4cc2-aa8c-b3a6d67ba2a4",
      info: {
        busiPass: 0,
        busiNo: 123,
        role:2,
        adminUserNo: "1268793259442966528",
        phone: '18278904218',
        type: 1,
        userName: '小明',
        roles: [{
          roleNo: "111",
          roleName: "edit",
        }]
      }
    }
  },
  '18278904217': {
    code: 0,
    data: {
      token: "14a2d93b-6ada-4cc2-aa8c-b3a6d67ba2a4",
      info: {
        adminUserNo: "1268793259442966528",
        phone: '18278904218',
        type: 1,
        role:2,
        busiPass: 0,
        busiNo: 123,
        userName: '小明',
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
  'select/busi/personnel': (data) => {
    console.log(data)
    return {
      code:0,
      data: [{
          pass: 1,
          ft: '停用',
          nick: '杰克',
          phone: '1827800374',
          uid: 216,
        },
        {
          pass: 1,
          ft: '管理员',
          nick: '小明',
          phone: '1827800374',
          uid: 215,
        },
        {
          pass: 0,
          ft: '申请绑定',
          nick: '珍妮',
          phone: '1827800374',
          uid: 214,
        },
        {
          pass: 1,
          ft: '库管员',
          nick: '杰克马',
          phone: '1827800374',
          uid: 213,
        },
      ]
    }
  },
  '/add/busi': (data) => {
    return {
      code: 0,
      msg: '创建成功'
    }
  },
  '/user/getUserWork': (data) => {
    return {
      code: 0,
      data: {
        personnelManagement: false,
        classSelect: false,
      }
    }
  },
  'getMyBusi': (data) => {
    return {
      code: 0,
      data: {
        name: '尔莫科技',
        contact: '杰克',
        phone: '18278904219',
        address: '北京',
      }
    }
  },
  '/user/modifyMyBusi': (data) => {
    return {
      code: 0,
      data: {
        busiNo: 1,
        name: '尔莫科技',
        contact: '杰克',
        phone: '18278904219',
        address: '北京',
      }
    }
  },
  'user/setUserType': (data) => {

    return {
      msg: '设置用户类型成功',
      code: 0,
    }
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