const API_HOST = "http://10.13.1.5:9021";
const DEBUG = true; //切换数据入口
const Mock = require("./mockApi")
// params没有参数请传一个空对象
function request(url, data, method, onSuccess, onFailed) {
  
    let isGet = method === 'get' ? true : false
    let params = "&"
    if (isGet) {
        let params = "&"
        for (var key in data) {
            params += key + "=" + data[key] + "?"
        }
        params = params.slice(0, params.length - 1)
      
    }

    if (!DEBUG) {
        wx.request({
            url: isGet ? API_HOST + url + params : +API_HOST + url,
            method: method ? method : "post",
            data: isGet ? '' : data,
            header: {
                'X-Auth-Token': 'a969c95b-3b17-489b-a736-971fd0b56ead'
            },
            success: function (res) {
                onSuccess(res.data);
            },
            fail: function (res) {
                onFailed && onFailed(res.data)
            },
        });
    } else {
        // 模拟请求延迟
        setTimeout(() => {
            onSuccess(Mock(url,data))

        }, 1000);
    }
}
module.exports = {
    request: request
}