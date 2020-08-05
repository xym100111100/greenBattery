var app = getApp();
import {
    removeToken,
    removeUserInfo
} from "../../utils/auth"

Page({
    data: {
        copyright: app.globalData.app_copy_right,
        phone: "",
        nick: "",
        type: ""
    },
    onLoad: function (a) {
        console.log(app.globalData)
        wx.setNavigationBarTitle({
            title: app.globalData.app_name + " - 我的账户"
        });
        let data  = {
            phone: app.globalData.me.cell,
            nick: app.globalData.me.nick,
            type: app.globalData.me.type
        };
        1 == app.globalData.me.userType ? data.type = "单位用户" : data.type = "个人用户"

         this.setData(data);
    },
    onShow: function () {},
    click_logout: function () { 
        // 删除用户信息
        removeToken()
        removeUserInfo()
        app.logout();
    },
    click_name: function () {
        var a = this;
        "" != this.data.nick ? app.post("set_nick", {
            nick: this.data.nick
        }, function (e) {
            app.setMe("nick", a.data.nick), app.toast("操作成功", "success");
        }) : app.alert("提示", "请输入姓名后再保存。");
    },
    click_type: function () {
        wx.showModal({
            title: "重要提示",
            content: "单位用户变为个人用户，将会解绑现有全部单位，是否重新选择类型？",
            success: function (a) {
                a.confirm && wx.navigateTo({
                    url: "/pages/login/type",
                    success: function (a) {
                        a.eventChannel.emit("receive", {
                            act: "reset",
                            type: app.globalData.me.type
                        });
                    }
                });
            }
        });
    }
});