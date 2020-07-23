var t = getApp();

Page({
    data: {
        copyright: "",
        ec: null,
        id: 0,
        name: "",
        date: "",
        action: 1,
        weight: "",
        amount: "",
        type: 1,
        loading: !1,
        btn_done: !1
    },
    onLoad: function(a) {
        var e = this;
        wx.setNavigationBarTitle({
            title: t.globalData.app_name + " - 记一笔"
        });
        var i = this.getOpenerEventChannel();
        i.on("receive", function(a) {
            a.ec = i, a.copyright = t.globalData.app_copy_right, a.date = e.today(), e.setData(a), 
            e.init();
        });
    },
    onUnload: function() {
        this.data.ec && "function" == typeof this.data.ec.emit && this.data.ec.emit("reload");
    },
    today: function() {
        var t = new Date();
        return t.getFullYear() + "-" + (1 + t.getMonth()).toString().padStart(2, "0") + "-" + t.getDate().toString().padStart(2, "0");
    },
    dateChange: function(t) {
        this.setData({
            date: t.detail.value
        });
    },
    actionChange: function(t) {
        this.setData({
            action: t.detail.value
        });
    },
    typeChange: function(t) {
        this.setData({
            type: t.detail.value
        });
    },
    init: function() {},
    click_log: function() {
        var t = this;
        wx.navigateTo({
            url: "log",
            success: function(a) {
                a.eventChannel.emit("receive", {
                    tid: t.data.id,
                    name: t.data.name
                });
            }
        });
    },
    input_weight: function(t) {
        this.setData({
            weight: t.detail.value - 0
        });
    },
    input_amount: function(t) {
        this.setData({
            amount: t.detail.value - 0
        });
    },
    click_done: function() {
        if ("" != this.data.weight) if (1 != this.data.id || "" != this.data.amount) {
            var a = {
                act: "write",
                tid: this.data.id,
                date: this.data.date,
                action: this.data.action,
                weight: this.data.weight,
                type: this.data.type,
                amount: this.data.amount
            };
            t.post("maker_log", a, function(a) {
                t.toast("保存成功", "success", 1e3), setTimeout(function() {
                    wx.navigateBack();
                }, 1e3);
            });
        } else t.alert("提示", "请填写计数数量"); else t.alert("提示", "请填写计数质量");
    }
});