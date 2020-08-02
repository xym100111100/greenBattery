var Mock = require("./mock")
const userInfo = {
  '18278904214': {
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
        role: 2,
      }
    }
  },
  '18278904213': { // 已经选择类型为单位的用户
    code: 0,
    data: {
      token: "14a2d93b-6ada-4cc2-aa8c-b3a6d67ba2a4",
        role: 2,
        userNo: "1268793259442966528",
        phone: '18278904218',
        type: 1,
        userName: '小明',
        busiNo:'232621',
        busiType:1
    }
  },
  '18278904212': {  // 已经选择类型为个人的用户
    code: 0,
    data: {
      token: "14a2d93b-6ada-4cc2-aa8c-b3a6d67ba2a4",
        state:1,
        cell:'18278904217',  
        userNo:'123',
        type:0
    }
  },
  '18278904211': {  // 第一次登陆的用户，角色和类型都没有
    code: 0,
    data: {
      token: "14a2d93b-6ada-4cc2-aa8c-b3a6d67ba2a4",
        state:1,
        cell:'18278904217',  
        userNo:'123'
    }
  }
}
const MockData = {
  '/login': (data) => {
    console.log(data)
    return userInfo[data.phone]
  },
  '/saveBusiDangerousType': (data) => {
    return {
      code:0,
      msg:'设置成功'
    }
  },
  '/getBusiDangerousType': (data) => {
   
    return {
      code:0,
      data:[31,45]
    }
  },
  'select/alltype': () => {
    return {
      code: 0,
      data: [{
          name: '核废料',
          typeNo: 31,
          capacity: 100,
        },
        {
          name: '废电池',
          typeNo: 45,
          capacity: 100,
        }
      ]
    }
  },
  '/company/selectCompanyPersonnel': (data) => {
    console.log(data)
    return {
      code: 0,
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
  '/company/getUserWork': (data) => {
    return {
      code: 0,
      data: {
        personnelManagement: true,
        classSelect: true, 
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