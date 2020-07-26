var API = require('../../utils/api.js')
import {
    getAdminUserNo
} from "../../utils/auth"

var app = getApp();

Page({
    data: {
        loading: !1,
        btn_deny: true,
        type: '',
        act: "set"
    },
    onLoad: function (t) {

        // var a = this, e = this.getOpenerEventChannel();
        // e.on && e.on("receive", function(t) {
        //     a.setData(t);
        // });
    },
    onReady: function () {},
    onShow: function () {
        wx.setNavigationBarTitle({
            title: app.globalData.app_name + " - 用户类型"
        })
    },
    click_type: function (t) {
        var type = parseInt(t.currentTarget.dataset.type)
        console.log(type)
        this.setData({
            type: type,
            btn_deny: false
        })
    },
    click_done: function () {
        if (this.data.type === '') {
            app.toast("请选择用户类型")
            return
        }
        this.setData({
            loading: true
        })
        API.request('user/setUserType', {
            type: this.data.type,
            adminUserNo: getAdminUserNo()
        }, 'put', (res) => {
            this.setData({
                loading: false
            })
            if (res.code === 0 && this.data.type === 0) {
                // 跳转到个人用户举报页面
                app.toast(res.msg);
                setTimeout(() => {
                    wx.reLaunch({
                        url: "/pages/index/report"
                    });
                }, 1000);
                return 
            }else if(res.code === 0 && this.data.type === 1){
                app.toast(res.msg);
                setTimeout(() => {
                    wx.reLaunch({
                        url: "/pages/index/index"
                    });
                }, 1000);
                return
            }
            app.toast(res.msg);
            
        })


        // this.data.type < 1 ? t.toast("请选择用户类型") : "reset" != this.data.act || t.globalData.me.type != this.data.type ? t.post("set_user_type", {
        //     token: t.globalData.me.token,
        //     act: this.data.act,
        //     type: this.data.type
        // }, function(e) {
        //     if (e.ok) {
        //         var n = {
        //             type: a.data.type
        //         };
        //         "reset" == a.data.act && (n.bid = 0), t.setMe(n), 1 == n.type ? wx.reLaunch({
        //             url: "/pages/busi/bind"
        //         }) : wx.reLaunch({
        //             url: "/pages/index/report"
        //         });
        //     } else t.alert("提示", e.msg);
        // }) : t.toast("类型没有变更。");
    }
});