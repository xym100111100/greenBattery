var t = getApp();

Page({
    data: {
        loading: !1,
        activeTab: 0,
        list: [],
        date1: "",
        date2: "",
        today: "",
        list1: [],
        box_show: !1,
        box_ani: {},
        box_idx: -1,
        box_weight: 0,
        box_amount: 0
    },
    onLoad: function() {
        wx.setNavigationBarTitle({
            title: t.globalData.app_name + " - 入库申请"
        }), this.setData({
            date1: this.first_day(),
            date2: this.today(),
            today: this.today()
        }), this.load_data();
    },
    click_tab: function(a) {
        var i = a.currentTarget.dataset.idx;
        this.setData({
            activeTab: i
        }), 0 == i ? (wx.setNavigationBarTitle({
            title: t.globalData.app_name + " - 入库申请"
        }), this.load_data()) : (wx.setNavigationBarTitle({
            title: t.globalData.app_name + " - 入库记录"
        }), this.load_data1());
    },
    load_data: function() {
        var a = this;
        t.post("stock", {
            act: "trans_in",
            tab: 0
        }, function(t) {
            a.setData({
                list: t.data
            });
        });
    },
    box_show: function() {
        this.setData({
            box_show: !0
        }), this.setData({
            box_ani: wx.createAnimation().top("20%").step({
                duration: 200,
                timingFunction: "ease-out"
            }).export()
        });
    },
    box_hide: function() {
        var t = this;
        this.setData({
            box_ani: wx.createAnimation().top(-300).step({
                duration: 200,
                timingFunction: "ease-in"
            }).export()
        }), setTimeout(function() {
            t.setData({
                box_show: !1
            });
        }, 250);
    },
    click_card: function() {},
    click_close: function(t) {
        this.box_hide();
    },
    input_weight: function(t) {
        this.setData({
            box_weight: t.detail.value
        });
    },
    input_amount: function(t) {
        this.setData({
            box_amount: t.detail.value
        });
    },
    click_row: function(t) {
        var a = this, i = t.currentTarget.dataset.idx;
        if (console.log(this.data.list[i]), 0 == this.data.activeTab) {
            var o = this.data.list[i];
            this.setData({
                box_idx: i,
                box_weight: o.a_weight ? o.a_weight / 1e3 : o.s_weight / 1e3,
                box_amount: o.a_amount ? o.a_amount : o.s_amount,
                box_show_amount: o.s_amount > 0
            }), this.box_show();
        } else wx.navigateTo({
            url: "/pages/collector/store_detail",
            success: function(t) {
                t.eventChannel.emit("receive", {
                    row: a.data.list1[i]
                });
            }
        });
    },
    click_deny: function() {
        var a = this;
        this.data.loading || new Promise(function(t, a) {
            wx.showModal({
                title: "重要提示",
                content: "拒收后收集点可以重新提交申请，确定拒收？",
                success: function(i) {
                    i.confirm ? t() : a();
                }
            });
        }).then(function(i) {
            a.setData({
                loading: !0
            }), t.post("stock", {
                act: "deny",
                id: a.data.list[a.data.box_idx].id
            }, function(i) {
                t.toast("操作成功", "success");
                var o = a.data.list;
                o.splice(a.data.box_idx, 1), a.setData({
                    loading: !1,
                    list: o
                }), a.box_hide();
            });
        });
    },
    click_done: function() {
        var a = this;
        this.data.loading || (this.setData({
            loading: !0
        }), t.post("stock", {
            act: "accept",
            id: this.data.list[this.data.box_idx].id,
            weight: this.data.box_weight,
            amount: this.data.box_amount
        }, function(i) {
            t.toast("操作成功", "success");
            var o = a.data.list;
            o.splice(a.data.box_idx, 1), a.setData({
                loading: !1,
                list: o
            }), a.box_hide();
        }));
    },
    today: function() {
        var t = new Date();
        return t.getFullYear() + "-" + (1 + t.getMonth()).toString().padStart(2, "0") + "-" + t.getDate().toString().padStart(2, "0");
    },
    first_day: function() {
        var t = new Date();
        return t.getFullYear() + "-" + (1 + t.getMonth()).toString().padStart(2, "0") + "-01";
    },
    touch_top: function() {
        console.log("touch_top");
    },
    touch_bottom: function() {
        console.log("touch_bottom");
    },
    load_data1: function() {
        var a = this, i = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
        if (i || !this.data.loading) {
            this.setData({
                loading: !0
            });
            var o = this.data.list1;
            t.post("stock", {
                act: "trans_in",
                tab: 1,
                d1: this.data.date1,
                d2: this.data.date2,
                skip: i ? 0 : o.length
            }, function(t) {
                i && (o = []), t.data.length > 0 && (o = o.concat(t.data)), a.setData({
                    list1: o,
                    loading: !1
                });
            });
        }
    },
    dateChange: function(t) {
        var a = t.currentTarget.dataset.idx, i = t.detail.value, o = {};
        o["date" + a] = i, this.setData(o);
    },
    click_query: function() {
        this.load_data1(!0);
    }
});