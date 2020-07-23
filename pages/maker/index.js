var e = getApp();

Page({
    data: {
        copyright: e.globalData.app_copy_right,
        trash: []
    },
    onLoad: function(a) {
        var t = this;
        wx.setNavigationBarTitle({
            title: e.globalData.app_name + " - 台账"
        }), this.getOpenerEventChannel().on("receive", function(a) {
            for (var n = a.trash, i = !1, r = 0; r < n.length; r++) n[r].checked && (i = !0), 
            n[r].w_increase = 0, n[r].w_reduce = 0, n[r].w_keep = 0, n[r].a_increase = 0, n[r].a_reduce = 0, 
            n[r].a_keep = 0;
            i ? (t.setData({
                trash: n
            }), t.init()) : e.alert("提示", "请先配置危废类型。", function() {
                wx.navigateBack();
            });
        });
    },
    onShow: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    init: function() {
        for (var a = this, t = this.data.trash, n = 0; n < t.length; n++) t[n].w_increase = 0, 
        t[n].w_reduce = 0, t[n].w_keep = 0, t[n].a_increase = 0, t[n].a_reduce = 0, t[n].a_keep = 0;
        e.post("maker_log", {
            act: "sum"
        }, function(e) {
            for (var n = 0; n < e.data.length; n++) for (var i = 0; i < t.length; i++) t[i].id == e.data[n].tid && (t[i].w_increase += e.data[n].w_increase, 
            t[i].w_reduce += e.data[n].w_reduce, t[i].w_keep += e.data[n].w_keep, t[i].a_increase += e.data[n].a_increase, 
            t[i].a_reduce += e.data[n].a_reduce, t[i].a_keep += e.data[n].a_keep);
            a.setData({
                trash: t
            });
        });
    },
    click_log: function(e) {
        var a = this, t = e.currentTarget.dataset.idx;
        wx.navigateTo({
            url: "log",
            events: {
                reload: function() {
                    a.init();
                }
            },
            success: function(e) {
                e.eventChannel.emit("receive", {
                    tid: a.data.trash[t].id,
                    name: a.data.trash[t].name
                });
            }
        });
    },
    click_trash: function(e) {
        var a = this, t = e.currentTarget.dataset.idx;
        wx.navigateTo({
            url: "/pages/maker/write",
            events: {
                reload: function() {
                    a.init();
                }
            },
            success: function(e) {
                e.eventChannel.emit("receive", a.data.trash[t]);
            }
        });
    }
});