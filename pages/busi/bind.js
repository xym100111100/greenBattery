var API = require('../../utils/api.js')

var t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
    return typeof t;
} : function(t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
}, e = getApp();

var  app = getApp()

Page({
    data: {
        eventChannel: null,
        loading: !1,
        activeTab: 0,
        search_bid: 0,
        wx_msg_bind_ret: "ACRwFd2SlzXf6RX2Ebsn0YDFICLgx3YFrJdGVDb4bt0",
        roles: [ {
            id: 1,
            text: "产废单位",
            intro: "产生危险废物，需要委托他人处理"
        }, {
            id: 2,
            text: "收集单位",
            intro: "收集危险废物，移交转运中心或处置单位"
        }, {
            id: 3,
            text: "转运中心(仅限蓄电池)",
            intro: "收集、接收蓄电池，移交处置单位"
        }, {
            id: 4,
            text: "生态环境局",
            intro: "固体废物与辐射管理科"
        }, {
            id: 5,
            text: "生态环境执法队",
            intro: "内江市环境监察执法支队"
        }, {
            id: 6,
            text: "网格员",
            intro: "政法委执行机构"
        }, {
            id: 7,
            text: "政法委",
            intro: "内江市委政法委员会"
        }, {
            id: 8,
            text: "公安局派出所",
            intro: "生态环境违法侦破、打击"
        } ],
        role_idx: 0,
        contact: "",
        cell: "",
        location_be_deny: !1,
        btn_getaddress: !0,
        btn_choose_on_map: !0,
        lng: "",
        lat: "",
        address: "",
        county: "",
        town: "",

        companyContactsName: "",
        companyContactsCell:'',
        companyName:'',
        companyType: 0,
        companyAddress:'',
        companyAreaName:'',
        companyCityName:'',
        searchData:[],
        companyNo:'',

    },
    onLoad: function() {

                this.setData({
                    companyContactsCell: app.globalData.me.cell,
                    contact: app.globalData.me.username ? app.globalData.me.username : "",
                    eventChannel: this.getOpenerEventChannel()
                })


        // this.setData({
        //     search: this.search.bind(this),
        //     cell: e.globalData.me.cell,
        //     contact: e.globalData.me.nick ? e.globalData.me.nick : "",
        //     eventChannel: this.getOpenerEventChannel()
        // })
         wx.setNavigationBarTitle({
            title: app.globalData.app_name + " - 绑定单位"
        });
    },
    companyNameInput(val){
  
        this.setData({
            companyName: val.detail.value
        })
    },
    name_input(val){
        this.setData({
            companyContactsName:val.detail.value
        })
    },
    cell_input(val){
        this.setData({
            companyContactsCell:val.detail.value
        })
    },

    onUnload: function() {
        this.data.eventChannel && "function" == typeof this.data.eventChannel.emit && this.data.eventChannel.emit("reload");
    },
    click_tab: function(val) {
        let  index = val.currentTarget.dataset.idx;
        this.setData({
            activeTab: index
        })
        if(index == 1 ){
            this.check_auth_for_location();
        } 
    },
    search: function(val) {
        API.request('/company/getBatteryCompanyByName',{companyName:val.detail},'get',(res)=>{
            if(res.data.length > 0 ){
             this.setData({
                 searchData:res.data
             })
            }else{
             this.setData({
                 searchData:[]
             })
            }
             
      })
    },
    selectresult: function(val) {
        
        this.setData({
            companyNo:val.detail.checkedNo
        })
        // var e = val.detail.item.value;
        // this.search_bid == e ? this.setData({
        //     search_bid: 0
        // }) : this.setData({
        //     search_bid: e
        // });
    },
    click_search_done: function() {
        if(!this.data.companyNo){
            app.alert("提示", "请选中要绑定的单位") 
            return ;
        }
        let payload = {}
        payload.companyNo = this.data.companyNo
        payload.userNo=app.globalData.me.userNo
        API.request('/user/bindingBatteryCompany',payload,'get',(res)=>{
                if(res.code === 0){
                    app.alert("提示","已申请绑定，等待单位管理员审核",(res)=>{
                        wx.navigateTo({
                            url: "/pages/index/index",})
                    })
                }
        })

        // var t = this;
        // this.data.loading || (this.data.search_bid < 1 ? e.alert("提示", "请选中要绑定的单位") : this.check_subscription_message().then(function(e) {
        //     t.send_to_server();
        // }, function(a) {
        //     t.request_subscription_message().then(function(e) {
        //         t.send_to_server();
        //     }, function(t) {
        //         e.alert("提示", "请允许订阅绑定单位审核结果通知，然后继续。");
        //     });
        // }));
    },
    check_subscription_message: function() {
        var t = this;
        return new Promise(function(e, a) {
            wx.getSetting({
                withSubscriptions: !0,
                success: function(n) {
                    n.subscriptionsSetting.mainSwitch && n.subscriptionsSetting.itemSettings && "accept" == n.subscriptionsSetting.itemSettings[t.data.wx_msg_bind_ret] ? e() : a("no");
                }
            });
        });
    },
    request_subscription_message: function() {
        var t = this;
        return new Promise(function(e, a) {
            wx.requestSubscribeMessage({
                tmplIds: [ t.data.wx_msg_bind_ret ],
                success: function(n) {
                    "requestSubscribeMessage:ok" == n.errMsg && "accept" == n[t.data.wx_msg_bind_ret] ? e() : a();
                }
            });
        });
    },
    send_to_server: function() {
        var a = this;
        this.setData({
            loading: !0
        }), e.post("busi_bind", {
            bid: this.data.search_bid
        }, function(n) {
            (!e.globalData.me.bid || e.globalData.me.bid < 1) && e.setMe("bid", a.data.search_bid), 
            e.toast("操作成功", "success"), setTimeout(function() {
                console.log(t(a.data.eventChannel.emit)), a.data.eventChannel && "function" == typeof a.data.eventChannel.emit ? wx.navigateBack() : wx.redirectTo({
                    url: "/pages/index/index"
                });
            }, 1e3);
        }, function() {
            a.setData({
                loading: !1
            });
        });
    },
    roleChange: function(t) {
        this.setData({
            role_idx: 1 * t.detail.value ,
            companyType: 1 * t.detail.value
        });
    },
    check_auth_for_location: function() {
      
        var t = this;
        if(this.data.location_be_deny){
            wx.openSetting({
                success: function(e) {
                    e.authSetting["scope.userLocation"] && (t.setData({
                        location_be_deny: !1
                    }), t.startLocation());
                }
            })
        }else{
            wx.authorize({
                scope: "scope.userLocation",
                success: function() {
                    t.startLocation();
                },
                fail: function(a) {
                    a.errMsg.includes("auth deny") ? e.alert("授权提示", "必须获取位置信息，才能创建单位。", function() {
                        wx.openSetting({
                            success: function(e) {
                                e.authSetting["scope.userLocation"] && (t.setData({
                                    location_be_deny: !1
                                }), t.startLocation());
                            }
                        });
                    }) : e.alert("错误", a.errMsg);
                }
            });
        }
         
    },
    startLocation: function() {
        var t = this;
        wx.getLocation({
            altitude: "true",
            isHighAccuracy: !0,
            highAccuracyExpireTime: 3e4,
            type: "gcj02",
            complete: function() {
                t.setData({
                    btn_location_deny: !1
                });
            },
            fail: function(t) {
                app.alert("失败", t.errMsg); 
            },
            success: function(e) {
                t.setData({
                    lng: e.longitude,
                    lat: e.latitude,
                    btn_getaddress: !1,
                    btn_choose_on_map: !1
                });
            }
        });
    },
    map_choose: function() {
        var t = this;
        wx.navigateTo({
            url: "/pages/map/index",
            events: {
                callback: function(e) {
                    t.setData(e);
                }
            },
            success: function(e) {
                e.eventChannel.emit("receive_location", {
                    lng: t.data.lng,
                    lat: t.data.lat
                });
            }
        });
    },
    get_address: function() {
        var a = this;
        wx.serviceMarket.invokeService({
            service: "wxc1c68623b7bdea7b",
            api: "rgeoc",
            data: {
                location: this.data.lat + "," + this.data.lng
            }
        }).then(function(n) {
            if ("invokeService:ok" == n.errMsg) {
                var i = "";
                if ("string" == typeof n.data) i = JSON.parse(n.data); else {
                    if ("object" != t(n.data)) return void e.alert("接口错误", "地址解析接口错误：" + i.message);
                    i = n.data;
                }
                if (0 == i.status) {
                    var s = {
                        address: i.result.address,
                        county: i.result.ad_info.adcode,
                        companyAddress:i.result.address_component.street+i.result.address_component.street_number,
                        companyAreaName:i.result.address_component.district,
                        companyCityName:i.result.address_component.city
                    };
                    i.result.address_reference && i.result.address_reference.town && (s.town = i.result.address_reference.town.id), 
                    a.setData(s);
                } else e.alert("接口错误", "地址解析接口错误：" + i.message);
            } else e.alert("接口错误", "调用地址解析接口错误：" + n.errMsg);
        }).catch(function(t) {
            console.error("invokeService fail", t);
        });
    },
    click_create_done: function() {
       let payload={
        companyType:this.data.companyType +1, // 因为选择的时候是从0开始的，后续优化处理
        companyContactsName:this.data.companyContactsName,
        companyName:this.data.companyName,
        companyContactsCell:this.data.companyContactsCell,
        companyAddress:this.data.companyAddress,
        companyAreaName:this.data.companyAreaName,
        companyCityName:this.data.companyCityName,
        latitude:this.data.lat,
        longitude:this.data.lng,
        createdUserNo:app.globalData.me.userNo,

       }

        API.request('/company/createBatteryCompany',payload,'post',(res)=>{
           if(res.code === 0){
            app.toast("创建成功", "success")
           }
         
        })


        // var t = this;
        // if (!this.data.loading) {
        //     var a = {
        //         act: "create"
        //     };
        //     this.data.companyName.length < 4 ? e.alert("提示", "请输入单位名称，至少4字。") : (a.companyName = this.data.companyName, 
        //     this.data.role_idx < 0 || !this.data.roles[this.data.role_idx] ? e.alert("提示", "请选择单位角色。") : (a.role = this.data.roles[this.data.role_idx].id, 
        //     this.data.contact.length < 2 ? e.alert("提示", "请输入您的姓名，至少2字。") : (a.contact = this.data.contact, 
        //     11 == this.data.cell.length && this.data.cell.startsWith("1") && !isNaN(this.data.cell) ? (a.cell = this.data.cell, 
        //     "" != this.data.address ? (a.lng = this.data.lng, a.lat = this.data.lat, a.address = this.data.address, 
        //     a.county = this.data.county, a.town = this.data.town, this.setData({
        //         loading: !0
        //     }), e.post("busi_bind", a, function(a) {
        //         e.setMe(a.data), e.toast("操作成功", "success"), setTimeout(function() {
        //             t.data.eventChannel && "function" == typeof t.data.eventChannel.emit ? wx.navigateBack() : wx.redirectTo({
        //                 url: "/pages/index/index"
        //             });
        //         }, 1e3);
        //     }, function(e) {
        //         t.setData({
        //             loading: !1
        //         });
        //     })) : e.alert("提示", "请获取地理位置。")) : e.alert("提示", "请输入正确的手机号。"))));
        // }
    }
});