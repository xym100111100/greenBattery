var API = require('../../utils/api.js')
import {
    getAdminUserNo
} from "../../utils/auth"

var app = getApp();

Page({
    data: {
        copyright: app.globalData.app_copy_right,
        wx_msg_bind_notify: "WaxtYavubpspcWMWzPaUcfTtf2836hZ1ZYYDYlCwHs0",
        wx_msg: !1,
        icon_color: "#004f1f",
        username: false,
        busi_name: "尔莫科技",
        busi_pass: 1,
        busi_block: 0,
        busi_role: 1,
        power: "",
        trash: [], 
        trash_badge: !1,
        worker_request: 0,
        applicationBindingCount:false, 
        wasteTypeSelect:false,
        companyType: '',
        companyRole:''
     
    },
    onLoad: function(t) {
        wx.setNavigationBarTitle({
            title: app.globalData.app_name + " - 首页"
        });
        this.init()
    },
    onReady: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        this.init(), wx.stopPullDownRefresh();
    },
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    init: function() {
     
        // 获取用户待处理工作与用户名称是否存在
        API.request('/company/getUserWork',{companyNo:app.globalData.me.companyNo},'get',(res)=>{
            
            this.setData({
                username:app.globalData.me.username?false:true,
                companyType:app.globalData.me.companyType,
                companyRole:app.globalData.me.companyRole
            })
            if(res.code === 0){
                this.setData({
                    applicationBindingCount:res.data.applicationBindingCount,
                    wasteTypeSelect:res.data.wasteTypeSelect,
                })
            }

        })


        
        // if (app.globalData.me && app.globalData.me.token) return 1 != app.globalData.me.type ? 2 == app.globalData.me.type ? void wx.reLaunch({
        //     url: "/pages/index/report"
        // }) : void wx.reLaunch({
        //     url: "/pages/login/type"
        // }) : void (!app.globalData.me.bid || app.globalData.me.bid < 1 ? wx.reLaunch({
        //     url: "/pages/busi/bind"
        // }) : this.my_busi());
        // wx.reLaunch({
        //     url: "/pages/login/login"
        // });
    },
    my_busi: function() {
        var t = this;
        0 != app.globalData.api_online ? app.post("my_busi", {
            act: "default"
        }, function(a) {
            app.setMe({
                power: a.data.power,
                role: a.data.role
            }), t.setData({
                username: app.globalData.me.username,
                busi_name: a.data.name,
                busi_block: a.data.block,
                busi_role: 1,
                busi_pass: a.data.pass,
                power: a.data.power,
                trash: a.data.trash,
                trash_badge: a.data.trash_badge,
                worker_request: a.data.worker_request ? a.data.worker_request : 0
            }), "1" == a.data.power ? t.check_wx_msg() : t.setData({
                wx_msg: !0
            });
        }) : setTimeout(function() {
            t.my_busi();
        }, 1e3);
    },
    check_wx_msg: function() {
        var t = this;
        this.data.wx_msg || wx.getSetting({
            withSubscriptions: !0,
            success: function(a) {
                a.subscriptionsSetting.mainSwitch && "accept" == a.subscriptionsSetting[t.data.wx_msg_bind_notify] ? t.setData({
                    wx_msg: !0
                }) : app.alert("提示", "作为管理员的您，需要负责单位人员的绑定审核与解绑知悉。请在接下来的订阅消息申请中选择同意。", function() {
                    t.request_subscription_message();
                });
            }
        });
    },
    request_subscription_message: function() {
        var t = this;
        this.data.wx_msg || wx.requestSubscribeMessage({
            tmplIds: [ this.data.wx_msg_bind_notify ],
            success: function(a) {
                "requestSubscribeMessage:ok" == a.errMsg && "accept" == a[t.data.wx_msg_bind_notify] ? t.setData({
                    wx_msg: !0
                }) : app.alert("提示", "请允许订阅通知消息，然后继续。", function() {
                    t.request_subscription_message();
                });
            },
            fail: function(e, t) {
             
            }
        });
    },
    click_busi: function() {
        wx.navigateTo({
            url: "/pages/busi/edit"
        });
    },
    click_worker: function() {
        wx.navigateTo({
            url: "/pages/worker/index"
        });
    },
    click_trash: function() {
        var that = this;
        wx.navigateTo({
            url: "/pages/index/trash",
            success: function(t) {
                t.eventChannel.emit("receive", {
                    role: that.data.busi_role,
                    trash: that.data.trash
                });
            }
        });
    },
    click_me: function() {
        wx.navigateTo({
            url: "/pages/index/me"
        });
    },
    click_report: function() {
        wx.navigateTo({
            url: "/pages/index/report"
        });
    },
    click_maker_log: function() {
        var that = this;
        wx.navigateTo({
            url: "/pages/maker/index",
            success: function(t) {
                t.eventChannel.emit("receive", {
                    trash: that.data.trash
                });
            }
        });
    },
    click_maker_scan: function() {
        let that = this
        wx.scanCode({
            onlyFromCamera: !0,
            scanType: [ "qrcode" ],
            complete: function(t) {
              
                if ("scanCode:ok" == t.errMsg && "QR_CODE" == t.scanType) {
                        wx.navigateTo({
                            url:'/pages/collector/maker_confirm?warehouseOutNo='+t.result ,
                            success: function(t) {
                                t.eventChannel.emit("receive", that.data.trade);
                            }
                        });
                } else "scanCode:fail cancel" != t.errMsg && e.alert("提示", "扫码失败：" + t.errMsg);

                // if ("scanCode:ok" == t.errMsg && "QR_CODE" == t.scanType) {
                //     var a = JSON.parse(t.result);
                //     if (!a.act) return void app.alert("错误", "未知的二维码");
                //     e.post("scan_qrcode", a, function(e) {
                //         wx.navigateTo({
                //             url: e.data.url,
                //             success: function(t) {
                //                 t.eventChannel.emit("receive", e.data.trade);
                //             }
                //         });
                //     });
                // } else "scanCode:fail cancel" != t.errMsg && e.alert("提示", "扫码失败：" + t.errMsg);
            }
        });
    },
    click_buy: function() {
        var that = this;
        wx.navigateTo({
            url: "/pages/collector/buy",
            success: function(t) {
                t.eventChannel.emit("receive", {
                    trash: that.data.trash
                });
            }
        });
    },
    click_put_store: function() {
        var that = this;
        wx.navigateTo({
            url: "/pages/collector/put_store",
            success: function(t) {
                t.eventChannel.emit("receive", {
                    trash: that.data.trash
                });
            }
        });
    },
    click_put_log: function() {
        wx.navigateTo({
            url: "/pages/collector/put_log"
        });
    },
    click_stock: function() {
        var that = this;
        wx.navigateTo({
            url: "/pages/store/stock",
            success: function(t) {
                t.eventChannel.emit("receive", {
                    trash: that.data.trash
                });
            }
        });
    },
    click_accept_store: function() {
        wx.navigateTo({
            url: "/pages/collector/store"
        });
    },
    click_accept_collector: function() {
        wx.navigateTo({
            url: "/pages/store/in"
        });
    }
});