var app = getApp();

Page({
    data: {
        loading: !1,
        list: [{
            trash: "废电池",
            name: '杰克',
            type: 1,
            amount: 22,
            weight: 200,
            checked: true,
            amount: 2
        }],
        checked_count: 0,
        idxs: []
    },
    onLoad: function (a) {
        wx.setNavigationBarTitle({
            title: app.globalData.app_name + " - 外勤入库"
        });
    },
    onShow: function () {
        // this.init();
    },
    onReachBottom: function () {},
    init: function () {
        var a = this;
        app.post("trash_collect", {
            act: "on_the_way"
        }, function (t) {
            for (var i in t.data) t.data[i].checked = !1;
            a.setData({
                list: t.data
            });
        });
    },
    click_row: function (t) {
        var a = t.currentTarget.dataset.idx,
            i = this.data.list,
            e = this.data.checked_count;
        i[a].checked = !i[a].checked, i[a].checked ? e++ : e--, this.setData({
            list: i,
            checked_count: e
        });
    },
    click_all: function () {
        var t = this.data.list;
        if (this.data.checked_count == t.length) {
            for (var a in t) t[a].checked = !1;
            this.setData({
                list: t,
                checked_count: 0
            });
        } else {
            for (var i in t) t[i].checked = !0;
            this.setData({
                list: t,
                checked_count: t.length
            });
        }
    },
    click_done: function () {
        var a = this;
        if (!this.data.loading) {
            for (var payload = [], e = 0, c = 0; c < this.data.list.length; c++) {
                if (this.data.list[c].checked) {
                    if (0 == e) {
                        e = this.data.list[c].tid;
                    } else if (e != this.data.list[c].tid) {
                        return void app.alert("提醒", "不同类型危废不能同一批次入库");
                    }
                    payload.push(this.data.list[c].id);
                }
            }
            if (payload.length < 1) {
                app.alert("提示", "请勾选要入库的记录")
                return
            }
            this.setData({
                loading: !0
            })
            app.post("trash_collect", {
                act: "put_in_store",
                ids: payload
            }, (a) => {
                if (a.ok) {
                    return app.toast("操作成功", "success", 500), void setTimeout(() => {
                        wx.navigateBack();
                    }, 500);
                }
                app.alert("提示", a.msg);
            }, () => {
                a.setData({
                    loading: !1
                });
            });
        }
    }
});