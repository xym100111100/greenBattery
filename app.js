App({
    globalData: {
        app_name: "美丽金小程序",
        app_copy_right: "美丽金小程序",
        api_root: "http://10.13.1.5:9021",
        api_path: "",
        api_online: !1,
        openid: "",
        me: {},
        roles: [ "未知角色", "产废单位", "收集点", "转运中心", "固体废物与辐射管理科", "内江市环境监察执法支队", "网格员", "政法委", "公安局派出所", "公众" ]
    },
    onLaunch: function() {
        var t = this;
        try {
            this.globalData.me = wx.getStorageSync("me") || {};
        } catch (t) {
            return void console.log(t);
        }
        this.globalData.me.token && this.post("token_login", {
            token: this.globalData.me.token
        }, function(a) {
            a.data.token = t.globalData.me.token, t.globalData.me = a.data, wx.setStorage({
                data: t.globalData.me,
                key: "me"
            });
        });
    },
    onShow: function() {},
    api_sign: function() {
        var t = {
            appid: "lswswxma",
            timestamp: new Date().getTime(),
            token: this.globalData.me.token
        }, a = require("/utils/sha256.js");
        return t.sign = a.sha256(t.timestamp + "9f1ffa042983909ad1c87fda"), t;
    },
    alert: function(t, a) {
        var e = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null;
        wx.showModal({
            title: t,
            content: a,
            showCancel: !1,
            success: function(t) {
                "function" == typeof e && e(t);
            }
        });
    },
    toast: function(t) {
        var a = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "none", e = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1500;
        wx.showToast({
            title: t,
            icon: a,
            duration: e
        });
    },
    setMe: function(t, a) {
        if ("string" == typeof t) this.globalData.me ? this.globalData.me[t] = a : this.globalData.me = {
            key: a
        }; else for (var e in t) this.globalData.me ? this.globalData.me[e] = t[e] : this.globalData.me = {
            k: t[e]
        };
        wx.setStorage({
            data: this.globalData.me,
            key: "me"
        });
    },
    post: function(t, a, e) {
        var o = this, i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : null;
        wx.request({
            timeout: 5e3,
            method: "POST",
            url: this.globalData.api_root + this.globalData.api_path + t,
            data: a,
            header:{...this.api_sign(),'X-Auth-Token':'16a1fd6b-3efe-490c-9787-329707fb3223'} ,
            complete: function() {
                i && i();
            },
            fail: function(t) {
                "request:fail timeout" == t.errMsg ? o.alert("错误", "访问不到服务器，请稍后再试") : "request:fail " == t.errMsg ? o.alert("错误", "访问服务器超时，请稍后再试") : o.alert("错误", t.errMsg);
            },
            success: function(t) {
                if (200 == t.statusCode) if (o.globalData.api_online = !0, t.data.ok) e(t.data); else if (t.data.data) switch (t.data.data.todo) {
                  case "logout":
                    o.logout();
                    break;

                  case "bind_busi":
                    o.bind_busi();
                    break;

                  case "edit_busi":
                    o.edit_busi();
                } else o.alert("提示", t.data.msg); else o.alert("错误", "服务器访问出错");
            }
        });
    },
    logout: function() {
        wx.removeStorage({
            key: "me"
        }), this.globalData.me = {};
        getCurrentPages();
        wx.reLaunch({
            url: "/pages/login/login"
        });
    },
    bind_busi: function() {
        var t = getCurrentPages();
        t.length > 0 && "pages/busi/bind" != t[t.length - 1].route && wx.redirectTo({
            url: "/pages/busi/bind"
        });
    },
    edit_busi: function() {
        var t = getCurrentPages();
        t.length > 0 && "pages/busi/edit" != t[t.length - 1].route && wx.redirectTo({
            url: "/pages/busi/edit"
        });
    }
});