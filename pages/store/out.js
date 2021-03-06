var API = require('../../utils/api.js')

var app = getApp();

Page({
    data: {
        copyright: app.globalData.app_copy_right,
        loading: !1,
        ec: null,
        // receivers: [
        //     {
        //      id:12,
        //      name:'尔莫科技'   
        //     },
        //     {
        //      id:1,
        //      name:'尔莫科技2'   
        //     }
        // ],
        receivers: [],
        receiver: 0,
        show_camera: !0,
        photo: [],
        a_increase: 17,
        a_keep: 17,
        a_reduce: 0,
        capacity: 150,
        checked: !0,
        id: 1,
        name: "HW49其他废物（废弃的铅蓄电池）",
        w_increase: 90900,
        w_keep: 90900,
        w_reduce: 0,
        target_type: 1,
        weight: "",
        type: 1,
        amount: "",
        show_transit: !1,
        current_photo: "",
        current_photo_idx: -1,
        preview: !1,
        companyWasteType: [],
    },
    onLoad: function (a) {
        var e = this;
        wx.setNavigationBarTitle({
            title: app.globalData.app_name + " - 出库"
        });
        var i = this.getOpenerEventChannel();
        i.on("receive", function (a) {
            console.log(a)
            a.ec = i, 1 == a.id && 2 == app.globalData.me.role ? a.show_transit = !0 : a.target_type = 2,
                e.setData(a), e.init();
        });
    },
    init: function () {
        API.request('/company/getBatteryCompanyByName', {}, 'get', (res) => {
            if (res.code === 0) {
                let data = res.data.filter(item=>item.companyNo != app.globalData.me.companyNo )
                this.setData({
                    receivers:data
                })
            }
        })

        API.request('/wasteType/getCompanyWasteType', {
            companyNo: app.globalData.me.companyNo
        }, 'get', (res) => {
            if (res.code === 0) {
                let name = ""
                res.data.map(item => {
                    name += item.wasteTypeName
                })
                this.setData({
                    name,
                    companyWasteType: res.data
                })
            }
        })


        // var a = this;
        // 1 == this.data.id ? t.post("get_tc", {}, function(e) {
        //     e.ok ? a.setData({
        //         receivers: e.data
        //     }) : t.toast(e.msg);
        // }) : this.setData({
        //     target_type: 2
        // });
    },
    click_target: function (t) {
        this.setData({
            target_type: 1 * t.detail.value
        });
    },
    click_receiver: function (t) {
        console.log(t)
        this.setData({
            receiver: t.detail.value
        });
    },
    click_type: function (t) {
        this.setData({
            type: t.detail.value
        });
    },
    click_camera: function () {
        var t = this;
        wx.navigateTo({
            url: "/pages/qrcode/camera",
            events: {
                camera_cb: function (a) {
                    var e = !0,
                        i = t.data.photo;
                    i.push(a), i.length > 2 && (e = !1), t.setData({
                        photo: i,
                        show_camera: e
                    });
                }
            }
        });
    },
    click_photo: function (t) {
        var a = t.currentTarget.dataset.idx;
        this.setData({
            preview: !0,
            current_photo: this.data.photo[a].tempImagePath,
            current_photo_idx: a
        });
    },
    click_del: function () {
        var t = this.data.photo;
        t.splice(this.data.current_photo_idx, 1), this.setData({
            photo: t,
            preview: !1,
            current_photo: "",
            current_photo_idx: -1
        });
    },
    click_close: function () {
        this.setData({
            preview: !1
        });
    },
    input_weight: function (t) {
        this.setData({
            weight: t.detail.value
        });
    },
    input_amount: function (t) {
        this.setData({
            amount: t.detail.value
        });
    },
    click_done: function () {
        var t = this;
        this.data.loading || setTimeout(function () {
            t.check_out();
        }, 500);
    },
    check_out: function () {
        var a = this,
            payload = {
                act: "trans_out"
            };
        if (this.data.id < 1) app.alert("提示", "请选择出库危废");
        else if (payload.tid = this.data.id, 1 == this.data.target_type || 2 == this.data.target_type)
            if (payload.target = this.data.target_type,
                1 == payload.target && this.data.receiver < 1) app.alert("提示", "请选择接收单位");
            else if (payload.receiver = this.data.receiver,
            "" == this.data.weight || isNaN(this.data.weight) || 1 * this.data.weight <= 0) app.alert("提示", "请填写本次出库质量（千克）");
        else {
            if (payload.weight = this.data.weight, 1 == payload.tid) {
                if (1 != this.data.type && 2 != this.data.type) return void app.alert("提示", "请选择蓄电池破损类别");
                if (payload.type = this.data.type, "" == this.data.amount || isNaN(this.data.amount) || this.data.amount - 0 < 1) return void app.alert("提示", "请填写本次出库数量（只）");
                payload.amount = this.data.amount;
            }
            if (1 == payload.target) {
                // this.setData({
                //     loading: !0
                // }) 
                let data = {
                    confirmCompanyNo: app.globalData.me.companyNo,
                    confirmUserNo: app.globalData.me.userNo,
                    applyCompanyNo: this.data.receiver,
                    damagedType: this.data.type,
                    warehouseOutQuantity: this.data.amount,
                    warehouseOutWeight: this.data.weight,
                    wasteTypeNo: this.data.companyWasteType[0].wasteTypeNo
                }


                // this.data.companyWasteType.map(item => {
                //     data.wasteTypeNo = data.wasteTypeNo + item.wasteTypeNo
                // })
                data.wasteTypeNo.substring(0, data.wasteTypeNo.length)
                API.request('/warehouseOut/transferCenter', data, 'post', (res) => {
                    if (res.code === 0) {
                        setTimeout(function () {
                            wx.navigateBack();
                        }, 500)
                    } else {
                        app.toast("提示", payload.msg);
                    }

                })

                // t.post("stock", payload, function (payload) {
                //     a.setData({
                //         loading: !1
                //     }), payload.ok ? (t.toast("操作成功", "success"), a.data.ec && "function" == typeof a.data.ec.emit && a.data.ec.emit("reload"),
                //         setTimeout(function () {
                //             wx.navigateBack();
                //         }, 1e3)) : t.alert("提示", payload.msg);
                // }, function () {
                //     a.setData({
                //         loading: !1
                //     });
                // });
            } else {
                if (this.data.photo.length < 1) return void t.alert("提示", "请拍摄处置单位接收凭证，最多3张。");
                this.setData({
                    loading: !0
                });
                for (var i = [], o = 0; o < this.data.photo.length; o++) i.push(this.upload(this.data.photo[o]));
                Promise.all(i).then(function (i) {
                    for (var o = [], s = 0; s < i.length; s++) {
                        if (!i[s].ok) return void t.toast(i[s].msg);
                        o.push(i[s].msg);
                    }
                    e.photos = o, t.post("stock", e, function (e) {
                        e.ok ? (t.toast("操作成功", "success"), a.data.ec && "function" == typeof a.data.ec.emit && a.data.ec.emit("reload"),
                            setTimeout(function () {
                                wx.navigateBack();
                            }, 1e3)) : t.alert("提示", e.msg);
                    }, function () {
                        a.setData({
                            loading: !1
                        });
                    });
                }).catch(function (a) {
                    t.toast(a.errMsg), console.log(a);
                });
            }
        } else t.alert("提示", "请选择出库目标");
    },
    upload: function (a) {
        var e = this;
        return new Promise(function (i, o) {
            wx.uploadFile({
                url: t.globalData.api_root + t.globalData.api_path + "upload",
                header: t.api_sign(),
                filePath: a.tempImagePath,
                name: "photo",
                success: function (t) {
                    i(JSON.parse(t.data));
                },
                fail: function (t) {
                    console.log(t), e.setData({
                        loading: !1
                    }), o(t);
                }
            });
        });
    }
});