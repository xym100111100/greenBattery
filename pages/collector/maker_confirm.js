var API = require('../../utils/api.js')
var app = getApp();

Page({
    data: {
        copyright: app.globalData.app_copy_right,
        loading: !1,
        btn_done: !1,
        id: 0,
        inputtime: 0,
        tid: 0,
        trash_name: "",
        weight: 0,
        type: 0,
        amount: 0,
        busi_name: "",
        nick: "",
        phone: ""
    },
    onLoad: function(data) {
        var e = this;
        wx.setNavigationBarTitle({
            title: app.globalData.app_name + " - 转出确认"
        }), 
        console.log(data)

        API.request('/warehouseOut/getWarehouseOutByNo', {
            warehouseOutNo:data.warehouseOutNo
        }, 'get', (res) => {
               console.log(res)
               this.setData({
                ...res.data     
               })
               
        })
        
       
        // this.getOpenerEventChannel().on("receive", function(t) {
        //     e.setData(t);
        // });
    },
    click_done: function() {

        API.request('/warehouseOut/warehouseOutConfirm', {
            warehouseOutNo:this.data.warehouseOutNo,
            confirmUserNo:app.globalData.me.userNo
        }, 'get', (res) => {
            if(res.code === 0){
                wx.toast("确认完成", "success"), setTimeout(function() {
                    wx.navigateBack();
                }, 1e3);
            }else{
                wx.toast(res.msg, "error")
            }
        })

        // t.post("trash_collect", {
        //     act: "maker_confirm",
        //     id: this.data.id
        // }, function(a) {
        //     t.toast("确认完成", "success"), setTimeout(function() {
        //         wx.navigateBack();
        //     }, 1e3);
        // });
    }
});