const API_HOST = "http://10.13.1.3:9055";
const DEBUG = false; //切换数据入口

// params没有参数请传一个空对象
function request(url, data, method, onSuccess, onFailed) {

    if (!DEBUG) {
        wx.request({
            url: API_HOST+url,
            method: method,
            data: data,
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
        // setTimeout(() => {
        //     onSuccess(Mock(url,data))

        // }, 500);
    }
}
module.exports = {
    request: request
}