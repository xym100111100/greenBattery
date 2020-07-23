var t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
    return typeof t;
} : function(t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
}, a = getApp();

Page({
    data: {
        copyright: a.globalData.app_copy_right,
        loading: !1,
        ec: null,
        current_photo: "",
        current_photo_idx: -1,
        preview: !1,
        show_camera: !0,
        gallery_show: !1,
        gallery_idx: 0,
        gallery_imgs: [],
        lng: 0,
        lat: 0,
        county: 0,
        town: 0,
        address: "",
        report_photo: [],
        report_text: "",
        list: []
    },
    onLoad: function(t) {
        wx.setNavigationBarTitle({
            title: a.globalData.app_name + " - 违法举报"
        }), this.init();
    },
    onShow: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    init: function() {
        a.globalData.me && a.globalData.me.token ? (this.load_data(), this.get_location()) : wx.reLaunch({
            url: "/pages/login/login"
        });
    },
    reset_camera_box: function() {
        this.setData({
            report_photo: [],
            report_text: "",
            show_camera: !0,
            loading: !1
        });
    },
    load_data: function() {
        var t = this, e = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
        if (0 != a.globalData.api_online) {
            var o = {
                act: "list"
            };
            e || (o.skip = this.data.list.length), a.post("report", o, function(o) {
                if (o.ok) {
                    for (var i = 0; i < o.data.length; i++) {
                        for (var r = o.data[i].imgs.split("|"), n = 0; n < r.length; n++) r[n] = a.globalData.api_root + r[n];
                        o.data[i].imgs = r;
                    }
                    if (e) t.setData({
                        list: o.data
                    }); else {
                        var s = t.data.list;
                        s = s.concat(o.data), t.setData({
                            list: s
                        });
                    }
                } else a.alert("提示", o.msg);
            });
        } else setTimeout(function() {
            t.load_data();
        }, 1e3);
    },
    request_permit: function() {
        var t = this;
        wx.openSetting({
            success: function(e) {
                console.log(e), e.authSetting["scope.userLocation"] ? t.get_location() : a.alert("提示", "您任然没有授权获取地理位置，需要授权才能继续。", function() {
                    t.request_permit();
                });
            }
        });
    },
    get_location: function() {
        var t = this;
        wx.getLocation({
            type: "wgs84",
            isHighAccuracy: !0,
            highAccuracyExpireTime: 5e3,
            success: function(a) {
                t.setData({
                    lng: a.longitude,
                    lat: a.latitude
                }), t.get_address();
            },
            fail: function(e) {
                a.alert("提示", "必须获取地理位置，才能确定管辖权归属。可以点击右上“···”按钮，在设置中启用位置信息。", function() {
                    t.request_permit();
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
        }).then(function(o) {
            if ("invokeService:ok" == o.errMsg) {
                var i = "";
                if ("string" == typeof o.data) i = JSON.parse(o.data); else {
                    if ("object" != t(o.data)) return void a.alert("接口错误", "地址解析接口错误：" + i.message);
                    i = o.data;
                }
                if (0 == i.status) {
                    var r = {
                        address: i.result.address,
                        county: i.result.ad_info.adcode
                    };
                    i.result.address_reference && i.result.address_reference.town && (r.town = i.result.address_reference.town.id), 
                    e.setData(r);
                } else a.alert("接口错误", "地址解析接口错误：" + i.message);
            } else a.alert("接口错误", "调用地址解析接口错误：" + o.errMsg);
        }).catch(function(t) {
            console.error("invokeService fail", t);
        });
    },
    click_row: function(t) {
        var a = t.currentTarget.dataset.idx;
        this.setData({
            gallery_imgs: this.data.list[a].imgs,
            gallery_show: !0,
            gallery_idx: 0
        });
    },
    click_camera: function() {
        var t = this;
        wx.navigateTo({
            url: "/pages/qrcode/camera",
            events: {
                camera_cb: function(a) {
                    var e = !0, o = t.data.report_photo;
                    o.unshift(a), o.length > 8 && (e = !1), t.setData({
                        report_photo: o,
                        show_camera: e
                    });
                }
            }
        });
    },
    click_photo: function(t) {
        var a = t.currentTarget.dataset.idx;
        this.setData({
            preview: !0,
            current_photo: this.data.report_photo[a].tempImagePath,
            current_photo_idx: a
        });
    },
    click_del: function() {
        var t = this.data.report_photo;
        t.splice(this.data.current_photo_idx, 1), this.setData({
            report_photo: t,
            preview: !1,
            current_photo: "",
            show_camera: !0,
            current_photo_idx: -1
        });
    },
    click_close: function() {
        this.setData({
            preview: !1
        });
    },
    click_cancel: function() {
        this.data.loading || this.reset_camera_box();
    },
    input_text: function(t) {
        this.setData({
            report_text: t.detail.value
        });
    },
    click_done: function() {
        var t = this;
        if (!this.data.loading) if (this.data.report_photo.length < 1) a.alert("提示", "请拍摄违法照片，最多9张。"); else if (this.data.report_text.length < 5) a.alert("提示", "请录入文字描述，最少5字"); else if (this.data.lng < 1 || this.data.lat < 1) a.alert("提示", "未能获取地理位置。"); else if ("" != this.data.address && "" != this.data.county) {
            this.setData({
                loading: !0
            }), wx.showLoading({
                title: "上传中"
            });
            for (var e = [], o = 0; o < this.data.report_photo.length; o++) e.push(this.upload(this.data.report_photo[o]));
            Promise.all(e).then(function(e) {
                for (var o = [], i = 0; i < e.length; i++) {
                    if (!e[i].ok) return void a.toast(e[i].msg);
                    o.push(e[i].msg);
                }
                var r = {
                    act: "new",
                    photos: o,
                    text: t.data.report_text,
                    lng: t.data.lng,
                    lat: t.data.lat,
                    county: t.data.county,
                    town: t.data.town,
                    address: t.data.address
                };
                a.post("report", r, function(e) {
                    e.ok ? (a.toast("操作成功", "success"), t.load_data(), t.reset_camera_box()) : a.alert("提示", e.msg);
                }, function() {
                    wx.hideLoading();
                });
            }).catch(function(e) {
                wx.hideLoading(), t.setData({
                    loading: !1
                }), a.toast(e.errMsg), console.log(e);
            });
        } else a.alert("提示", "地址解析失败");
    },
    upload: function(t) {
        return new Promise(function(e, o) {
            wx.uploadFile({
                url: a.globalData.api_root + a.globalData.api_path + "upload",
                header: a.api_sign(),
                filePath: t.tempImagePath,
                name: "photo",
                success: function(t) {
                    e(JSON.parse(t.data));
                },
                fail: function(t) {
                    console.log(t), o(t);
                }
            });
        });
    }
});