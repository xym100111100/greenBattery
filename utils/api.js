const API_HOST = "http://127.0.0.1:9055";
const DEBUG = false; //切换数据入口
const Mock = require("./mockApi")
// params没有参数请传一个空对象
function request(url, data, method, onSuccess, onFailed) {
    let isGet = method === 'get' ? true : false
    let params = "?"
    if (isGet) {
        for (var key in data) {
            params += key + "=" + data[key] + "&"
        }
        params = params.slice(0, params.length - 1)
      
    }
    let newUrl = isGet ? API_HOST + url + params : API_HOST + url
    if (!DEBUG) {
        wx.request({
            url: newUrl,
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

        }, 500);
    }
}
module.exports = {
    request: request
}