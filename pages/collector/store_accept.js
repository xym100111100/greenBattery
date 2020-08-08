var API = require('../../utils/api.js')

var app = getApp();

Page({
    data: {
        copyright: app.globalData.app_copy_right,
        ec: null,
        loading: !1,
        btn_done: !1,
        accepttime: 0,
        // collect: [ {
        //     id: 0,
        //     confirmtime: "2020-04-20 12:04",
        //     ou_bid: 0,
        //     name: "XX公司",
        //     tid: 1,
        //     trash_name: "HW49",
        //     transportWeight: 6e3,
        //     type: 1,
        //     transportQuantity: 1
        // } ,
        // {
        //     id: 2,
        //     confirmtime: "2020-04-20 12:04",
        //     ou_bid: 0,
        //     name: "XX公司",
        //     tid: 1,
        //     trash_name: "HW49",
        //     transportWeight: 6e3,
        //     type: 1,
        //     transportQuantity: 1
        // } ],
        collect: [],
        id: 0,
        tid: 0,
        trash_name: "",
        nick: "小明",
        phone: "",
        s_time: 0,
        applyWeight: 0,
        applyQuantity: 0,
        s_uid: 0,
        box_show: !1,
        box_ani: {},
        box_idx: -1,
        box_title: "",
        box_weight: 0,
        tmp_weight: 0,
        box_amount: 0,
        tmp_amount: 0,

        warehouseNo: ''

    },
    onLoad: function (payload) {
        let e = this
        wx.setNavigationBarTitle({
            title: app.globalData.app_name + " - 入库确认"
        });

        var i = this.getOpenerEventChannel();
        i.on("receive", function (t) {
            t.row.ec = i, e.setData(t.row), e.load_data();
        });
    },
    box_show: function () {
        this.setData({
            box_show: !0
        }), this.setData({
            box_ani: wx.createAnimation().top("20%").step({
                duration: 200,
                timingFunction: "ease-out"
            }).export()
        });
    },
    box_hide: function () {
        var t = this;
        this.setData({
            box_ani: wx.createAnimation().top(-300).step({
                duration: 200,
                timingFunction: "ease-in"
            }).export()
        }), setTimeout(function () {
            t.setData({
                box_show: !1
            });
        }, 250);
    },
    load_data: function () {
        API.request('/warehouse/getWarehouseByWarehouseNo', {
            warehouseNo: this.data.warehouseNo
        }, 'get', (res) => {
            if (res.code === 0) {
                res.data.transport.map(item => {
                    item.wasteTypeName = item.wasteTypeNo == '1' ? '废电池' : '其他'
                })
                this.setData({
                    collect: res.data.transport
                })
            } else {
                app.toast(res.msg, "error")
            }
        })

        // var a = this;
        // t.post("trash_collect", {
        //     act: "store_list_trash",
        //     id: this.data.id
        // }, function(t) {
        //     a.setData({
        //         collect: t.data
        //     });
        // });
    },
    click_card: function () {},
    click_row: function (t) {
        var a = t.currentTarget.dataset.idx,
            e = this.data.collect[a];
        this.setData({
            box_title: "修改第 " + (a + 1) + " 条记录",
            box_idx: a,
            tmp_weight: e.accept_weight ? e.accept_weight / 1e3 : e.transportWeight / 1e3,
            tmp_amount: e.accept_amount ? e.accept_amount : e.transportQuantity,
            box_show_amount: e.transportQuantity > 0
        }), this.setData({
            box_weight: this.data.tmp_weight,
            box_amount: this.data.tmp_amount
        }), this.box_show();
    },
    click_close: function (t) {
        this.box_hide();
    },
    input_weight: function (t) {
        this.setData({
            box_weight: t.detail.value - 0
        });
    },
    input_amount: function (t) {
        this.setData({
            box_amount: t.detail.value - 0
        });
    },
    click_edit: function () {
        if (this.data.box_idx < 0) t.alert("提示", "缺少修改目标");
        else if ("" == this.data.box_weight || isNaN(this.data.box_weight) || this.data.box_weight <= 0) t.alert("提示", "请输入正确的质量");
        else if (this.data.box_show_amount && ("" == this.data.box_amount || isNaN(this.data.box_amount) || this.data.box_amount < 1)) t.alert("提示", "请输入正确的数量");
        else if (this.data.collect[this.data.box_idx]) {
            var a = this.data.collect,
                e = this.data.box_idx;
            a[e].transportWeight != 1e3 * this.data.box_weight ? a[e].accept_weight = 1e3 * this.data.box_weight : delete a[e].accept_weight,
                this.data.box_show_amount && (a[e].transportQuantity != 1 * this.data.box_amount ? a[e].accept_amount = 1 * this.data.box_amount : delete a[e].accept_amount);
            for (var i = 0, o = 0, c = 0; c < this.data.collect.length; c++) i += this.data.collect[c].accept_weight ? this.data.collect[c].accept_weight : this.data.collect[c].transportWeight,
                this.data.box_show_amount && (o += this.data.collect[c].accept_amount ? this.data.collect[c].accept_amount : this.data.collect[c].transportQuantity);
            var n = {
                collect: a
            };
            i != this.data.s_weight ? n.a_weight = i : n.a_weight = 0, o != this.data.s_amount ? n.a_amount = o : n.a_amount = 0,
                this.setData(n), this.box_hide();
        } else t.alert("提示", "修改目标丢失");
    },
    click_deny: function () {
        var a = this;
        new Promise(function (t, a) {
            wx.showModal({
                title: "重要提示",
                content: "拒收后外勤可以重新组合收集记录，再次提交入库申请。确定拒收？",
                success: function (e) {
                    e.confirm ? t() : a();
                }
            });
        }).then(function (e) {
            t.post("trash_collect", {
                act: "store_reject",
                id: a.data.id,
                back: a.data.collect
            }, function (e) {
                t.toast("操作成功", "success"), a.data.ec && "function" == typeof a.data.ec.emit && a.data.ec.emit("reload"),
                    setTimeout(function () {
                        wx.navigateBack();
                    }, 1e3);
            });
        });
    },
    click_done: function () {
        console.log(this.data.applyWeight)
        console.log(this.data.applyQuantity)
        let payload = {
            receiveCompanyNo: app.globalData.me.companyNo,
            receiveUserNo: app.globalData.me.userNo,
            receiveQuantity: this.data.applyQuantity,
            receiveWeight: this.data.applyWeight,
            warehouseNo: this.data.warehouseNo
        }
        API.request('/warehouse/confirmWarehouse', payload, 'put', (res) => {
            if (res.code === 0) {
                app.toast("入库成功", "success")
                setTimeout(function () {
                    wx.navigateBack();
                }, 500);
            }else{
                app.toast(res.msg, "success")
            }
          
        })

        // for (var a = this, e = 0, i = 0, o = !1, c = [], n = 0; n < this.data.collect.length; n++) o || !this.data.collect[n].accept_weight && !this.data.collect[n].accept_amount || (o = !0), 
        // e += this.data.collect[n].accept_weight ? this.data.collect[n].accept_weight : this.data.collect[n].transportWeight, 
        // i += this.data.collect[n].accept_amount ? this.data.collect[n].accept_amount : this.data.collect[n].transportQuantity, 
        // c.push({
        //     id: this.data.collect[n].id,
        //     accept_weight: this.data.collect[n].accept_weight,
        //     accept_amount: this.data.collect[n].accept_amount
        // });
        // var s = {
        //     act: "store_accept",
        //     id: this.data.id,
        //     tid: this.data.tid,
        //     row_change: o ? 1 : 0,
        //     sum: {
        //         transportWeight: e,
        //         transportQuantity: i
        //     },
        //     rows: c
        // };
        // t.post("trash_collect", s, function(e) {
        //     t.toast("操作成功", "success"), a.data.ec && "function" == typeof a.data.ec.emit && a.data.ec.emit("reload"), 
        //     setTimeout(function() {
        //         wx.navigateBack();
        //     }, 1e3);
        // });
    }
});