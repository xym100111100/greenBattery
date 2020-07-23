var t = getApp();

Page({
    data: {
        loading: !1,
        list: [],
        checked_count: 0,
        idxs: []
    },
    onLoad: function(a) {
        wx.setNavigationBarTitle({
            title: t.globalData.app_name + " - 外勤入库"
        });
    },
    onShow: function() {
        this.init();
    },
    onReachBottom: function() {},
    init: function() {
        var a = this;
        t.post("trash_collect", {
            act: "on_the_way"
        }, function(t) {
            for (var i in t.data) t.data[i].checked = !1;
            a.setData({
                list: t.data
            });
        });
    },
    click_row: function(t) {
        var a = t.currentTarget.dataset.idx, i = this.data.list, e = this.data.checked_count;
        i[a].checked = !i[a].checked, i[a].checked ? e++ : e--, this.setData({
            list: i,
            checked_count: e
        });
    },
    click_all: function() {
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
    click_done: function() {
        var a = this;
        if (!this.data.loading) {
            for (var i = [], e = 0, c = 0; c < this.data.list.length; c++) if (this.data.list[c].checked) {
                if (0 == e) e = this.data.list[c].tid; else if (e != this.data.list[c].tid) return void t.alert("提醒", "不同类型危废不能同一批次入库");
                i.push(this.data.list[c].id);
            }
            i.length < 1 ? t.alert("提示", "请勾选要入库的记录") : (this.setData({
                loading: !0
            }), t.post("trash_collect", {
                act: "put_in_store",
                ids: i
            }, function(a) {
                if (a.ok) {
                    return t.toast("操作成功", "success", 1e3), void setTimeout(function() {
                        wx.navigateBack();
                    }, 1e3);
                } else t.alert("提示", a.msg);
            }, function() {
                a.setData({
                    loading: !1
                });
            }));
        }
    }
});