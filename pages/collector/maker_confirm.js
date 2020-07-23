var t = getApp();

Page({
    data: {
        copyright: t.globalData.app_copy_right,
        loading: !1,
        btn_done: !1,
        id: 0,
        inputtime: 0,
        tid: 0,
        trash_name: "",
        weight: 0,
        type: 0,
        amount: 0,
        busi_name: "",
        nick: "",
        phone: ""
    },
    onLoad: function(a) {
        var e = this;
        wx.setNavigationBarTitle({
            title: t.globalData.app_name + " - 转出确认"
        }), this.getOpenerEventChannel().on("receive", function(t) {
            e.setData(t);
        });
    },
    click_done: function() {
        t.post("trash_collect", {
            act: "maker_confirm",
            id: this.data.id
        }, function(a) {
            t.toast("确认完成", "success"), setTimeout(function() {
                wx.navigateBack();
            }, 1e3);
        });
    }
});