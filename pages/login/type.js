var t = getApp();

Page({
    data: {
        loading: !1,
        btn_deny: !0,
        type: 0,
        act: "set"
    },
    onLoad: function(t) {
        var a = this, e = this.getOpenerEventChannel();
        e.on && e.on("receive", function(t) {
            a.setData(t);
        });
    },
    onReady: function() {},
    onShow: function() {
        wx.setNavigationBarTitle({
            title: t.globalData.app_name + " - 用户类型"
        }), this.setData({
            role: t.globalData.me.role
        });
    },
    click_type: function(t) {
        var a = parseInt(t.currentTarget.dataset.type);
        this.data.type == a ? this.setData({
            type: 0,
            btn_deny: !0
        }) : this.setData({
            type: a,
            btn_deny: !1
        });
    },
    click_done: function() {
        var a = this;
        this.data.type < 1 ? t.toast("请选择用户类型") : "reset" != this.data.act || t.globalData.me.type != this.data.type ? t.post("set_user_type", {
            token: t.globalData.me.token,
            act: this.data.act,
            type: this.data.type
        }, function(e) {
            if (e.ok) {
                var n = {
                    type: a.data.type
                };
                "reset" == a.data.act && (n.bid = 0), t.setMe(n), 1 == n.type ? wx.reLaunch({
                    url: "/pages/busi/bind"
                }) : wx.reLaunch({
                    url: "/pages/index/report"
                });
            } else t.alert("提示", e.msg);
        }) : t.toast("类型没有变更。");
    }
});