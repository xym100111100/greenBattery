var t = getApp();

Page({
    data: {
        copyright: t.globalData.app_copy_right,
        ec: null,
        loading: !1,
        btn_done: !1,
        collect: [],
        id: 0,
        state: 0,
        tid: 0,
        trash_name: "",
        nick: "",
        phone: "",
        time: 0,
        weight: 0,
        amount: 0,
        uid: 0
    },
    onLoad: function(a) {
        var e = this;
        wx.setNavigationBarTitle({
            title: t.globalData.app_name + " - 收集记录"
        }), this.getOpenerEventChannel().on("receive", function(t) {
            e.setData(t.row), e.load_data();
        });
    },
    load_data: function() {
        var a = this;
        t.post("trash_collect", {
            act: "put_in_log_trash",
            id: this.data.id,
            state: this.data.state
        }, function(t) {
            a.setData({
                collect: t.data
            });
        });
    }
});