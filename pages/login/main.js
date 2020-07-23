var a = getApp();

Page({
    data: {
        copyright: a.globalData.app_copy_right,
        loadidng: !0
    },
    onLoad: function(t) {
        wx.setNavigationBarTitle({
            title: a.globalData.app_name
        });
    },
    onReady: function() {},
    onShow: function() {
        var a = this;
        setTimeout(function() {
            a.init();
        }, 500);
    },
    init: function() {
        if (a.globalData.me && a.globalData.me.token) {
            if (1 != a.globalData.me.type) return 2 == a.globalData.me.type ? void wx.reLaunch({
                url: "/pages/index/report"
            }) : void wx.reLaunch({
                url: "/pages/login/type"
            });
            if (!a.globalData.me.bid || a.globalData.me.bid < 1) return void wx.reLaunch({
                url: "/pages/busi/bind"
            });
            wx.reLaunch({
                url: "/pages/index/index"
            });
        }
        this.setData({
            loadidng: !1
        });
    },
    login: function() {
        // this.data.loadidng || wx.reLaunch({
        //     url: "/pages/login/login"
        // });
    }
});