var t = getApp();

Page({
    data: {
        copyright: t.globalData.app_copy_right,
        phone: "",
        nick: "",
        type: ""
    },
    onLoad: function(a) {
        wx.setNavigationBarTitle({
            title: t.globalData.app_name + " - 我的账户"
        });
        var e = {
            phone: t.globalData.me.phone,
            nick: t.globalData.me.nick,
            type: t.globalData.me.type
        };
        1 == t.globalData.me.type ? e.type = "单位用户" : e.type = "个人用户", this.setData(e);
    },
    onShow: function() {},
    click_logout: function() {
        t.logout();
    },
    click_name: function() {
        var a = this;
        "" != this.data.nick ? t.post("set_nick", {
            nick: this.data.nick
        }, function(e) {
            t.setMe("nick", a.data.nick), t.toast("操作成功", "success");
        }) : t.alert("提示", "请输入姓名后再保存。");
    },
    click_type: function() {
        wx.showModal({
            title: "重要提示",
            content: "单位用户变为个人用户，将会解绑现有全部单位，是否重新选择类型？",
            success: function(a) {
                a.confirm && wx.navigateTo({
                    url: "/pages/login/type",
                    success: function(a) {
                        a.eventChannel.emit("receive", {
                            act: "reset",
                            type: t.globalData.me.type
                        });
                    }
                });
            }
        });
    }
});