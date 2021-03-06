var API = require('../../utils/api.js')
import {
    setToken,
    setUserInfo,
    setAdminUserNo,
    getUserOpenIdKey,
    setUserOpenIdKey
} from "../../utils/auth"

var app = getApp();

Page({
    data: {
        userInfo: {},
        hasUserInfo: !1,
        canIUse_getUserInfo: wx.canIUse("button.open-userType.getUserInfo"),
        canIUse_getPhoneNumber: !0,
        copyright: "",
        code_loading: !1,
        login_loading: !1,
        btn_code_text: "获取验证码",
        btn_code_second: 60,
        btn_code_deny: !0,
        btn_login_deny: !0,
        input_code_deny: !0,
        cell: "18278904219", 
        code: "333333",

    },
    onLoad: function (e) {
        // wx.setNavigationBarTitle({
        //     title: t.globalData.app_name + " - 登录"
        // }), this.setData({
        //     copyright: t.globalData.app_copy_right
        // }), t.globalData.me.role && (t.globalData.me.role > 0 ? wx.redirectTo({
        //     url: "/pages/index"
        // }) : wx.redirectTo({
        //     url: "/pages/login/role" 
        // })), wx.login({
        //     success: function(e) {
        //         e.code ? t.post("wx_api", {
        //             act: "code_to_openid",
        //             code: e.code
        //         }, function(e) {
        //             t.globalData.openid = e.data.openid;
        //         }) : (t.alert("错误", "微信登录失败：" + e.errMsg), console.log("wx.login -> ", e));
        //     },
        //     fail: function(e) {
        //         t.alert("错误", "微信登录失败。"), console.log("wx.login -> ", e);
        //     }
        // });
        this.getInfo()
        if(!getUserOpenIdKey()){
            this.login().then(res => {
                // 获取用户信息
                this.getOpenid(res.code)
            })
        }
    },
    getInfo(){
        let that = this
        wx.getUserInfo({
            success: function(res) {
                console.log(res)
              var userInfo = res.userInfo
              that.setData({
                userInfo
               })
            }
          })
    },
    login() {
        return new Promise(function (resolve, reject) {
            wx.login({
                success: function (res) {
                    if (res.code) {
                        resolve(res);
                    } else {
                        reject(res);
                    }
                },
                fail: function (err) {
                    reject(err);  
                }
            });
        });
    },
    getOpenid(code) {
        API.request('/getOpenid', { 
            code
        }, 'get', (res) => {
            if(res.code === 0){
                setUserOpenIdKey(res.data)
            }
        })
    },
    onReady: function () {},
    onShow: function () {},
    onHide: function () {},
    onUnload: function () {},
    onPullDownRefresh: function () {},
    onReachBottom: function () {},
    onShareAppMessage: function () {},
    sdkver_big_than: function (t) {
        var e = wx.getSystemInfoSync().SDKVersion;
        return (e = e.split("."))[1] && (e[1] = e[1].padStart(2, "0")), e[2] && (e[2] = e[2].padStart(2, "0")),
            e = parseInt(e.join("")), (t = t.split("."))[1] && (t[1] = t[1].padStart(2, "0")),
            t[2] && (t[2] = t[2].padStart(2, "0")), t = parseInt(t.join("")), e >= t;
    },
    getPhoneNumber: function (val) {
        var that = this
        console.log(val)
        // wx.request({
        //   url: '/loginByWechat',
        //   method:'get', 
        //   data:{
        //     openid:getUserOpenIdKey(),
        //     iv:val.detail.iv,
        //     encryptedData:val.detail.encryptedData
        //   }
        // })
        API.request('/loginByWechat', {   
            openid:getUserOpenIdKey(),
            iv:val.detail.iv,
            encryptedData:val.detail.encryptedData,
            username:this.data.userInfo.nickName 
        }, 'get', (res) => {
           if(res.code === 0){
            // 设置用户信息
            app.globalData.me = res.data
            app.globalData.me.nick = res.data.userName
            setAdminUserNo(res.data.userNo)
            setUserInfo(JSON.stringify(res.data)) 

            // 设置token
            setToken(res.data.token)

            that.login_ok(res.data)
           }
        })

        //     "getPhoneNumber:ok" == e.detail.errMsg && e.detail.encryptedData && e.detail.iv ? (wx.showLoading({
        //         title: "登录中",
        //         mask: !0
        //     }), app.post("wx_api", {
        //         act: "getphone",
        //         openid: app.globalData.openid,
        //         encrypt: e.detail.encryptedData,
        //         iv: e.detail.iv
        //     }, function (t) {
        //         n.login_ok(t);
        //     }, function () {
        //         wx.hideLoading();
        //     })) : app.alert("提示", "微信用户信息用作登录信息与系统功能绑定，需要获得授权才能继续。");
    },
    input_phone: function (val) {
        let cell = val.detail.value
        this.setData({
            cell
        })

        // var e = t.detail.value, n = !0;
        // "18982960805" != e ? (11 == e.length && e.startsWith("1") && !isNaN(e) && "获取验证码" == this.data.btn_code_text && (n = !1), 
        // this.setData({
        //     cell: e,
        //     btn_code_deny:n 
        // })) : this.setData({
        //     cell: e,
        //     input_code_deny: true
        // });
    },
    input_code: function (t) {
        var e = t.detail.value,
            n = !0;
        6 != e.length || isNaN(e) || (n = !1), this.setData({
            code: e,
            btn_login_deny: n
        });
    },
    get_code: function () {
        var e = this;
        this.data.btn_code_deny || (11 == this.data.cell.length && !isNaN(this.data.cell) && this.data.cell.startsWith("1") ? (this.setData({
            btn_code_deny: !0,
            code_loading: !0
        }), t.post("phone_code", {
            cell: this.data.cell
        }, function (n) {
            t.toast("5分钟有效", "success"), e.setData({
                btn_code_text: "(" + e.data.btn_code_second + ")重新获取"
            }), setTimeout(e.btn_code_count_down, 1e3);
        }, function () {
            e.setData({
                code_loading: !1,
                input_code_deny: !1
            });
        })) : t.alert("手机号错误", "请输入正确的手机号，11位数字。"));
    },
    btn_code_count_down: function () {
        this.data.btn_code_second > 1 ? (this.data.btn_code_second--, this.setData({
            btn_code_text: "(" + this.data.btn_code_second + ")重新获取"
        }), setTimeout(this.btn_code_count_down, 1e3)) : this.setData({
            btn_code_second: 60,
            btn_code_deny: !1,
            btn_code_text: "获取验证码"
        });
    },
    click_login: function () {
        let that = this
        if (11 === this.data.cell.length && !isNaN(this.data.cell)) {
            wx.showLoading({
                title: "登录中",
            })
            API.request('/login', {
                cell: this.data.cell,
                code: this.data.code
            }, 'get', (res) => {

                wx.hideLoading()
                if (res.code === 0) {
                    // 设置用户信息
                    app.globalData.me = res.data
                    app.globalData.me.nick = res.data.userName
                    setAdminUserNo(res.data.userNo)
                    setUserInfo(JSON.stringify(res.data))

                    // 设置token
                    setToken(res.data.token)
                    //跳转页面
                    that.login_ok(res.data)

                } else {
                    app.alert("手机号错误", "该用户不存在")
                }
            })
        } else {
            app.alert("手机号错误", "请输入正确的手机号，11位数字。")
        }



        // this.data.btn_login_deny || (11 == this.data.cell.length && !isNaN(this.data.cell) && this.data.cell.startsWith("1") ? 6 != this.data.code.length || isNaN(this.data.code) ? t.alert("验证码错误", "请输入正确的验证码。") : (this.setData({
        //     login_loading: !0,
        //     btn_login_deny: !0
        // }),
        //  wx.showLoading({
        //     title: "登录中",
        //     mask: !0
        // })
        //  t.post("login", {
        //     cell: this.data.cell,
        //     code: this.data.code
        // }, function(t) {
        //     e.login_ok(t);
        // }, function() {
        //     wx.hideLoading(), e.setData({
        //         btn_login_deny: !1,
        //         login_loading: !1
        //     });
        // })) : t.alert("手机号错误", "请输入正确的手机号，11位数字。"));


        // e.login_ok();
    },
    login_ok: function (info) {
        // 如果用户类型是空的则跳转到设置用户类型界面

        // 如果是个人用户则跳到违法举报界面 
        if (info.userType === 0) {
            wx.redirectTo({
                url: "/pages/index/report"
            })
        } else if(info.userType === 1) {
            //  如果没有绑定单位则跳到绑定单位界面
            if (!info.companyNo) {
                wx.redirectTo({
                    url: "/pages/busi/bind" 
                })
            } else {
                // 跳到首页
                wx.redirectTo({
                    url: "/pages/index/index"
                })

            }
        }

        if (!info.userType) {
            // 跳到绑定页面
            wx.redirectTo({
                url: "/pages/login/type" 
            })
        }




        // var n = {
        //     id: e.data.id,
        //     cell: e.data.cell,
        //     nick: e.data.nick,
        //     token: e.data.token,
        //     userType: e.data.userType
        // };
        // 1 == n.userType && (n.bid = e.data.bid, n.power = e.data.power), t.setMe(n), 0 == n.userType ? wx.redirectTo({
        //     url: "/pages/login/userType"
        // }) : 1 == n.userType ? n.bid < 1 ? wx.redirectTo({
        //     url: "/pages/busi/bind"
        // }) : wx.redirectTo({
        //     url: "/pages/index/index"
        // }) : wx.redirectTo({
        //     url: "/pages/index/report"
        // });

        // wx.redirectTo({
        //     url: "/pages/index/index"
        // })
    }
});