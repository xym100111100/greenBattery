
var API = require('../../utils/api.js')
import {
    getAdminUserNo
} from "../../utils/auth"

var t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
    return typeof t;
} : function(t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
}, a = getApp();

Page({
    data: {
        eventChannel: null,
        list: [{
            id:1,
            bind_block:2,
            name:'尔莫科技', 
            pass:1
        },
    ],
        bid: 0,
        name: "",
        contact: "",
        input_phone: "",
        phone: "",
        location_be_deny: !1,
        btn_getaddress: !1,
        btn_choose_on_map: !1,
        lng: "",
        lat: "",
        address: "",
        county: "",
        town: "",
        loading: !1,
        btn_done: !0,
        unbind_idx: -1,
        unbind_busi_name: "",
        half_dialog_show: !1,
        half_dialog_buttons: [ {
            type: "default",
            className: "",
            text: "暂不解绑",
            value: 0
        }, {
            type: "primary",
            className: "",
            text: "立即解绑",
            value: 1
        } ]
    },
    onLoad: function(t) {
        this.init();
    },
    onReady: function() {},
    onShow: function() {
        wx.setNavigationBarTitle({
            title: a.globalData.app_name + " - 我的单位"
        });
    },
    onHide: function() {},
    onUnload: function() {},
    init: function() {
        // 获取绑定的单位信息
        API.request('getMyBusi',{userNo:getAdminUserNo()},'get',(res)=>{
            console.log(res)
            this.setData({
                ...res.data
            })
        })
        // var that = this;
        // that.setData({ 
        //             bid: 1,
        //             name: '安布雷拉',
        //             contact: '18278904219',
        //             phone:  '18278904219',
        //             input_phone:  '18',
        //             lng: 1,
        //             lat: 2,
        //             address: '北京',
        //             power: 'power'
        //         });

        // var t = this;
        // a.post("my_busi", {}, function(e) {
        //     t.setData({
        //         list: e.data
        //     });
        //     for (var n = 0; n < e.data.length; n++) if (e.data[n].id == a.globalData.me.bid) {
        //         t.setData({
        //             bid: e.data[n].id,
        //             name: e.data[n].name,
        //             contact: e.data[n].contact,
        //             phone: e.data[n].phone,
        //             input_phone: e.data[n].phone,
        //             lng: e.data[n].lng,
        //             lat: e.data[n].lat,
        //             address: e.data[n].address,
        //             power: e.data[n].power
        //         });
        //         break;
        //     }
        // });
    },
    click_bind_new: function() {
        var t = this;
        wx.navigateTo({
            url: "bind",
            events: {
                reload: function() {
                    console.log("reload called"), t.init();
                }
            }
        });
    },
    click_busi: function(t) {
        var e = this, n = this.data.list[t.currentTarget.dataset.idx];
        n.id != this.data.bid && (1 != n.busi_block ? 1 != n.bind_block ? n.pass < 1 ? a.alert("提示", "正在等待单位管理员审核，通过后才能切换到该单位") : a.post("my_busi", {
            act: "setdef",
            bid: n.id
        }, function(t) {
            a.setMe({
                bid: n.id,
                power: n.power
            }), e.setData({
                bid: n.id,
                name: n.name,
                contact: n.contact,
                phone: n.phone,
                input_phone: n.phone,
                lng: n.lng,
                lat: n.lat,
                address: n.address,
                power: n.power
            });
        }) : a.alert("提示", "您与该单位的绑定关系暂时被停用") : a.alert("提示", "该单位暂时被停用"));
    },
    click_unbind: function(t) {
        this.setData({
            unbind_idx: t.currentTarget.dataset.idx,
            unbind_busi_name: this.data.list[t.currentTarget.dataset.idx].name,
            half_dialog_show: !0
        });
    },
    click_half_dialog: function(t) {
        var e = this;
        if (this.setData({
            half_dialog_show: !1
        }), 1 == t.detail.item.value) {
            var n = this.data.list[this.data.unbind_idx].id;
            a.post("my_busi", {
                act: "unbind",
                bid: n
            }, function(t) {
                var i = e.data.list;
                if (i.splice(e.data.unbind_idx, 1), e.setData({
                    list: i
                }), n == a.globalData.me.bid) {
                    for (var o = null, s = 0; s < i.length; s++) if (0 == i[s].busi_block && 0 == i[s].bind_block && 1 == i[s].pass) {
                        o = i[s];
                        break;
                    }
                    null != o ? (a.setMe({
                        bid: o.id,
                        power: o.power
                    }), e.setData({
                        bid: o.id,
                        name: o.name,
                        contact: o.contact,
                        phone: o.phone,
                        input_phone: o.phone,
                        lng: o.lng,
                        lat: o.lat,
                        address: o.address,
                        power: o.power
                    }), e.input_typing()) : (a.setMe({
                        bid: 0,
                        power: ""
                    }), e.setData({
                        bid: 0,
                        name: "",
                        contact: "",
                        phone: "",
                        input_phone: "",
                        lng: 0,
                        lat: 0,
                        address: "",
                        power: "",
                        btn_choose_on_map: !0,
                        btn_getaddress: !0
                    }));
                }
            });
        }
    },
    input_typing: function(t) {
        this.setData({
            btn_done: false
        });
    },
    get_location: function() {
        var t = this;
        this.data.location_be_deny ? wx.openSetting({
            success: function(a) {
                a.authSetting["scope.userLocation"] && t.startLocation();
            }
        }) : wx.authorize({
            scope: "scope.userLocation",
            success: function() {
                t.startLocation();
            },
            fail: function(t) {
                t.errMsg.includes("auth deny") ? a.alert("授权提示", "需要有授权才能获取位置。") : a.alert("错误", t.errMsg);
            }
        });
    },
    startLocation: function() {
        var t = this;
        wx.getLocation({
            altitude: "true",
            isHighAccuracy: !0,
            highAccuracyExpireTime: 3e4,
            type: "gcj02",
            fail: function(t) {
                a.alert("失败", t.errMsg);
            },
            success: function(a) {
                t.setData({
                    lng: a.longitude,
                    lat: a.latitude
                }), t.get_address();
            }
        });
    },
    map_choose: function() {
        var t = this;
        wx.navigateTo({
            url: "/pages/map/index",
            events: {
                callback: function(a) {
                    t.setData(a), t.input_typing();
                }
            },
            success: function(a) {
                a.eventChannel.emit("receive_location", {
                    lng: t.data.lng,
                    lat: t.data.lat
                });
            }
        });
    },
    get_address: function() {
        var e = this;
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
                    if ("object" != t(n.data)) return void a.alert("接口错误", "地址解析接口错误：" + i.message);
                    i = n.data;
                }
                if (0 == i.status) {
                    var o = {
                        address: i.result.address,
                        county: i.result.ad_info.adcode,
                        btn_done: !1
                    };
                    i.result.address_reference && i.result.address_reference.town && (o.town = i.result.address_reference.town.id), 
                    e.setData(o);
                } else a.alert("接口错误", "地址解析接口错误：" + i.message);
            } else a.alert("接口错误", "调用地址解析接口错误：" + n.errMsg);
        }).catch(function(t) {
            console.error("invokeService fail", t);
        });
    },
    input_phone: function(t) {
        this.setData({
            input_phone: t.detail.value,
            btn_done: !1
        });
    },
    click_edit_done: function() {
        console.log(this.data)
        API.request('/user/modifyMyBusi',this.data,'put',(res)=>{
            console.log(res)
           if(res.code === 0){
              a.alert("提示", "修改成功")
           }
        })

        // var t = this, e = {
        //     act: "edit",
        //     bid: this.data.bid
        // };
        // this.data.name.length < 4 ? a.alert("提示", "请输入单位名称，至少4字。") : (e.name = this.data.name, 
        // this.data.contact.length < 2 ? a.alert("提示", "请输入您的姓名，至少2字。") : (e.contact = this.data.contact, 
        // 11 == this.data.input_phone.length && this.data.input_phone.startsWith("1") && !isNaN(this.data.input_phone) ? (e.phone = this.data.input_phone, 
        // "" != this.data.address ? (e.lng = this.data.lng, e.lat = this.data.lat, e.address = this.data.address, 
        // e.county = this.data.county, e.town = this.data.town, this.setData({
        //     loading: !0,
        //     btn_done: !0
        // }), a.post("my_busi", e, function(e) {
        //     t.data.eventChannel && t.data.eventChannel.emit("reload"), a.toast("操作成功", "success"), 
        //     setTimeout(function() {
        //         wx.navigateBack();
        //     }, 1e3);
        // }, function(a) {
        //     t.setData({
        //         loading: !1,
        //         btn_done: !1
        //     });
        // })) : a.alert("提示", "请获取地理位置。")) : a.alert("提示", "请输入正确的手机号。")));
    }
});